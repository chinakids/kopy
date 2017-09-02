import inquirer from 'inquirer'

async function getMockedAnswers(mockPrompts, prompts) {
  const answers = {}

  for (const prompt of prompts) {
    const { name } = prompt

    if (Object.hasOwnProperty.call(mockPrompts, prompt.name)) {
      answers[name] = mockPrompts[prompt.name]
    } else {
      answers[name] =
        typeof prompt.default === 'function'
          ? prompt.default(answers)
          : prompt.default
    }

    if (prompt.type === 'confirm' && typeof answers[name] === 'undefined') {
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
      if (!res) {
        throw new Error(`Validation failed at prompt: "${name}"`)
      }
    }
  }

  return answers
}

export default function ask(prompts, mockPrompts) {
  return ctx => {
    if (mockPrompts && prompts) {
      return getMockedAnswers(mockPrompts, prompts).then(answers => {
        ctx.meta = { answers }
      })
    }

    if (prompts) {
      return inquirer.prompt(prompts).then(answers => {
        // prevent from ReferenceErrors
        for (const prompt of prompts) {
          if (!Object.prototype.hasOwnProperty.call(answers, prompt.name)) {
            answers[prompt.name] = undefined
          }
        }

        ctx.meta = { answers }
      })
    }
  }
}
