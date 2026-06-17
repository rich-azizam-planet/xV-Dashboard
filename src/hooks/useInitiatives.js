import { useState } from 'react'
import { SEED_INITIATIVES } from '../data/initiatives'

const STORAGE_KEY = 'xv_initiatives'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : SEED_INITIATIVES
  } catch {
    return SEED_INITIATIVES
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useInitiatives() {
  const [initiatives, setInitiatives] = useState(load)

  function addInitiative(initiative) {
    const next = [...initiatives, { ...initiative, id: crypto.randomUUID(), createdAt: new Date().toISOString().slice(0, 10) }]
    setInitiatives(next)
    save(next)
  }

  function updateInitiative(id, updates) {
    const next = initiatives.map(i => i.id === id ? { ...i, ...updates } : i)
    setInitiatives(next)
    save(next)
  }

  function deleteInitiative(id) {
    const next = initiatives.filter(i => i.id !== id)
    setInitiatives(next)
    save(next)
  }

  return { initiatives, addInitiative, updateInitiative, deleteInitiative }
}
