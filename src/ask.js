import inquirer from 'inquirer'

async function getMockedAnswers(mockPrompts, prompts) {
  const answers = {}

  for (const prompt of prompts) {
    const { name } = prompt

    if (Object.hasOwnProperty.call(mockPrompts, prompt.name)) {
      answers[name] = mockPrompts[prompt.name]
    } else if (typeof prompt.default === 'function') {
      const res = prompt.default(answers)
      // eslint-disable-next-line no-await-in-loop
      answers[name] = res.then ? await res : res
    } else {
      answers[name] = prompt.default
    }

    if (prompt.type === 'confirm' && typeof answers[name] === 'undefined') {
      // Since it defaults to true in inquirer.js
      answers[name] = true
    }

    // Filter
    if (typeof prompt.filter === 'function') {
      const res = prompt.filter(answers[name], answers)
      // eslint-disable-next-line no-await-in-loop
      answers[name] = res.then ? await res : res
    }
    // Validation
    if (typeof prompt.validate === 'function') {
      let res = prompt.validate(answers[name], answers)
      // eslint-disable-next-line no-await-in-loop
      res = res.then ? await res : res
      if (typeof res === 'string') {
        // eslint-disable-next-line unicorn/prefer-type-error
        throw new Error(`Validation failed at prompt "${name}":\n${res}`)
      } else if (!res) {
        throw new Error(`Validation failed at prompt "${name}"`)
      }
    }
  }

  return answers
}

const promptsSeparator = (prompts, mockPrompts) => {
  const hasMockPrompts = [];
  const noMockPrompts = [];
  for(const prompt of prompts){
    if(Object.hasOwnProperty.call(mockPrompts, prompt.name)) {
      hasMockPrompts.push(prompt)
    }else{
      noMockPrompts.push(prompt)
    }
  }
  return {
    hasMockPrompts,
    noMockPrompts
  }
}


export default function ask(prompts = [], mockPrompts = {}) {
  return async ctx => {

    const { hasMockPrompts, noMockPrompts } = promptsSeparator(prompts, mockPrompts);

    let hasMockPromptsAnswers = {};
    let noMockPromptsAnswers = {};
    
    if (mockPrompts && hasMockPrompts) {
      hasMockPromptsAnswers = await getMockedAnswers(mockPrompts, hasMockPrompts);
    }

    if (noMockPrompts) {
      noMockPromptsAnswers = await inquirer.prompt(noMockPrompts).then(answers => {
        // prevent from ReferenceErrors
        for (const prompt of noMockPrompts) {
          if (!Object.prototype.hasOwnProperty.call(answers, prompt.name)) {
            answers[prompt.name] = undefined
          }
        }
        return answers;
        //ctx.meta = { answers }
      })
    }
    ctx.meta = { answers: { ...mockPrompts, ...hasMockPromptsAnswers, ...noMockPromptsAnswers } }
  }
}
