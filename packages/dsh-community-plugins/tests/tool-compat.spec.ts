import { describe, expect, it, vi } from 'vitest'
import type { ToolDefinition } from '@deepseek-ai/dsh-tools'
import { registerCompatibleStoreTools } from '../src/tool-compat.ts'

function tool(name: string): ToolDefinition {
  return {
    name,
    description: name,
    parameters: {},
    output: {
      schema: { type: 'object' },
      render: () => [],
    },
    execute: vi.fn(),
  } as unknown as ToolDefinition
}

describe('Store tool compatibility', () => {
  it('registers only missing tools and preserves the existing definitions', () => {
    const existing = tool('store_search')
    const registry = {
      get: vi.fn((name: string) => name === existing.name ? existing : undefined),
      register: vi.fn(),
    }
    const definitions = [existing, tool('store_catalog')]

    const registered = registerCompatibleStoreTools(registry, definitions)

    expect(registered.map(definition => definition.name)).toEqual(['store_catalog'])
    expect(registry.get).toHaveBeenCalledWith('store_search')
    expect(registry.get).toHaveBeenCalledWith('store_catalog')
    expect(registry.register).toHaveBeenCalledOnce()
    expect(registry.register).toHaveBeenCalledWith(definitions[1])
  })

  it('does not register an approval gate when every Store tool already exists', () => {
    const registry = {
      get: vi.fn(() => tool('existing-store-tool')),
      register: vi.fn(),
    }

    expect(registerCompatibleStoreTools(registry, [tool('store_search'), tool('store_remove')])).toEqual([])
    expect(registry.register).not.toHaveBeenCalled()
  })
})
