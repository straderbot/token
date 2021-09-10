import * as hre from 'hardhat'
import { Artifact } from 'hardhat/types'
import q from 'inquirer'

import '@nomiclabs/hardhat-ethers'
import { ParamType } from '@ethersproject/abi'


// MARK: - Main

async function main() {
  /**
   * We first compile the project. Then we deploy the selected contract
   * and setup everything that's needed.
   */
  await hre.run('compile')

  /**
   * Get the account balance.
   */
  const [deployer] = await hre.ethers.getSigners()

  console.log('Deploying contracts with the account:', deployer.address)

  const balance = await deployer.getBalance()

  console.log('Account balance:', balance.toString())

  /**
   * Select the artifact to deploy.
   */
  let artifact: Artifact

  const artifactFullyQualifiedNames =
    await hre.artifacts.getAllFullyQualifiedNames()

  const artifacts = await Promise.all(
    artifactFullyQualifiedNames.map((name) => hre.artifacts.readArtifact(name)),
  )

  // Inquire about the artifact.
  artifact = await q
    .prompt({
      name: 'artifact',
      type: 'list',
      loop: false,
      message: 'Select the contract you want to deploy.',
      choices: artifacts.map((artifact) => ({
        value: artifact,
        name: artifact.sourceName,
      })),
    })
    .then((res) => res.artifact)

  /**
   * Ask for the input parameters and deploy the contract.
   */
  const factory = await hre.ethers.getContractFactory(artifact.contractName)
  const inputs = factory.interface.deploy.inputs

  /**
   * Deploy the contract using parameters.
   */
  const params = await Promise.all(
    inputs.map((input) => {
      if (input.type === 'tuple') {
        return getParams(input.components)
      }
      return getParam(input)
    }),
  )

  console.log(`Ready to deploy...`)

  const { submit } = await q.prompt({
    type: 'confirm',
    name: 'submit',
    message: `Deploy contract ${artifact.contractName}?`,
  })

  if (submit) {
    console.log(`Deploying!`)
    const contract = await factory.deploy(...params)
    console.log(`Deployed: ${contract.address}`)
  } else {
    console.log(`Not deploying...`)
  }
}

// MARK: - Start

if (require.main == module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

// MARK: - Utils

/**
 * Inquires for parameters from parameter types.
 */
async function getParams(inputs: ParamType[]): Promise<{ [key: string]: any }> {
  // Create a record if we have a record.
  let rec: { [key: string]: any } = {}

  for (const param of inputs) {
    /**
     * Recusively gets parameters for inputs each input.
     *
     * https://docs.soliditylang.org/en/v0.5.3/abi-spec.html
     */
    if (param.type === 'tuple') {
      rec[param.name] = await getParams(param.components)
    } else {
      // Ask for scalar otherwise.
      rec[param.name] = await getParam(param)
    }
  }

  return rec
}

/**
 * Inquires for a single parameter.
 */
function getParam(input: ParamType): any {
  return q.prompt(getParamPrompt(input, 'value')).then((res) => res.value)
}

// https://docs.soliditylang.org/en/v0.5.3/abi-spec.html
function getParamPrompt<T extends string, Q extends Record<T, any>>(
  param: ParamType,
  field: T,
): q.QuestionCollection<Q> {
  const message = `${param.name} (${param.type})`

  // Address
  if (param.type === 'address') {
    return {
      type: 'input',
      name: field,
      message: message,
    }
  }

  if (param.type === 'address[]') {
    return {
      type: 'input',
      name: field,
      message: message,
      transformer: (input) => {
        return input.split(/\s*\,\s*/)
      },
    }
  }

  // Integers
  if (/u?int\d+/.test(param.type)) {
    return {
      type: 'number',
      name: field,
      message: message,
    }
  }

  // Boolean
  if (param.type === 'bool') {
    return {
      type: 'confirm',
      name: field,
      message: message,
      default: false,
    }
  }

  // String
  if (param.type === 'string') {
    return {
      type: 'input',
      name: field,
      message: message,
    }
  }

  throw 'NOT IMPLEMENTED'
}
