const LessPass = require('lesspass')
const getDistance = require('leven')
const CSV = require('csv-string')

// Generate password with LessPass
const generate = params => (value, index) => {
  // Increment password length
  params.profile.options.length = params.minLength + index
  return LessPass.generatePassword(params.profile, params.masterPassword)
}

// Convert passwords to objects with additional properties
const format = items => {
  return items.map((value, index, items) => {
    const first = index < 1
    const previous = first ? null : items[index - 1]
    const distance = first ? null : getDistance(previous, value)
    return {
      value,
      size: value.length,
      distance
    }
  })
}

// Output to CSV format
const output = (items) => {
  const header = 'Password,Size,Distance\n'
  return items.reduce((acc, value) => {
    const row = CSV.stringify(value)
    return acc.concat(row)
  }, header)
}

// LessPass settings + loop params
const params = {
  profile: {
    site: 'www.example.com',
    login: 'contact@example.org',
    options: {
      lowercase: true,
      uppercase: true,
      digits: true,
      symbols: true,
      length: 16,
      counter: 1
    }
  },
  masterPassword: 'My_P45Sw0Rd',
  minLength: 6,
  count: 60
}

const items = new Array(params.count).fill(null).map(generate(params))

Promise.all(items)
  .then(format)
  .then(output)
  .then(console.log)
  .catch(console.error)
