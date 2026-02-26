// Shared filtering engine for Vite workspace templates

export const OPERATORS = {
  text: [
    { value: 'contains', label: 'contains' },
    { value: 'not_contains', label: 'does not contain' },
    { value: 'equals', label: 'is' },
    { value: 'not_equals', label: 'is not' },
    { value: 'empty', label: 'is empty' },
    { value: 'not_empty', label: 'is not empty' }
  ],
  select: [
    { value: 'equals', label: 'is' },
    { value: 'not_equals', label: 'is not' },
    { value: 'in', label: 'is any of' },
    { value: 'not_in', label: 'is none of' }
  ],
  date: [
    { value: 'equals', label: 'is' },
    { value: 'before', label: 'is before' },
    { value: 'after', label: 'is after' },
    { value: 'on_or_before', label: 'is on or before' },
    { value: 'on_or_after', label: 'is on or after' }
  ],
  number: [
    { value: 'equals', label: 'equals' },
    { value: 'not_equals', label: 'does not equal' },
    { value: 'greater_than', label: 'is greater than' },
    { value: 'less_than', label: 'is less than' },
    { value: 'greater_equal', label: 'is greater than or equal to' },
    { value: 'less_equal', label: 'is less than or equal to' }
  ]
}

export function applyFilter(data, condition) {
  return data.filter((item) => {
    const hasNested = item && typeof item === 'object' && item.fields && typeof item.fields === 'object'
    const fieldValue = hasNested ? item.fields[condition.field] : item[condition.field]
    const filterValue = condition.value

    if (condition.operator !== 'empty' && condition.operator !== 'not_empty') {
      if (fieldValue === null || fieldValue === undefined) return false
    }

    switch (condition.operator) {
      case 'contains':
        return typeof fieldValue === 'string' && typeof filterValue === 'string'
          ? fieldValue.toLowerCase().includes(filterValue.toLowerCase())
          : false
      case 'not_contains':
        return typeof fieldValue === 'string' && typeof filterValue === 'string'
          ? !fieldValue.toLowerCase().includes(filterValue.toLowerCase())
          : true
      case 'equals':
        if (typeof fieldValue === 'string' && typeof filterValue === 'string') {
          return fieldValue.toLowerCase() === filterValue.toLowerCase()
        }
        return fieldValue === filterValue
      case 'not_equals':
        if (typeof fieldValue === 'string' && typeof filterValue === 'string') {
          return fieldValue.toLowerCase() !== filterValue.toLowerCase()
        }
        return fieldValue !== filterValue
      case 'before':
        return new Date(fieldValue) < new Date(filterValue)
      case 'after':
        return new Date(fieldValue) > new Date(filterValue)
      case 'on_or_before':
        return new Date(fieldValue) <= new Date(filterValue)
      case 'on_or_after':
        return new Date(fieldValue) >= new Date(filterValue)
      case 'greater_than':
        return Number(fieldValue) > Number(filterValue)
      case 'less_than':
        return Number(fieldValue) < Number(filterValue)
      case 'greater_equal':
        return Number(fieldValue) >= Number(filterValue)
      case 'less_equal':
        return Number(fieldValue) <= Number(filterValue)
      case 'empty':
        return fieldValue === null || fieldValue === undefined || fieldValue === ''
      case 'not_empty':
        return !(fieldValue === null || fieldValue === undefined || fieldValue === '')
      default:
        return true
    }
  })
}

export function applyFilters(data, conditions) {
  if (!Array.isArray(conditions) || conditions.length === 0) return data
  return conditions.reduce((acc, cond) => applyFilter(acc, cond), data)
}
