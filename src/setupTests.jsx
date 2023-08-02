import '@testing-library/jest-dom'
import { vi, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
	cleanup()
})

// Global mocks
Element.prototype.scrollTo = vi.fn()
vi.mock('axios')