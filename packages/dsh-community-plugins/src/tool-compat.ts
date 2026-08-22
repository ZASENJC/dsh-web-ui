import type { ToolDefinition } from '@deepseek-ai/dsh-tools'

export interface CompatibleToolRegistry {
  get(name: string): ToolDefinition | undefined
  register(definition: ToolDefinition): () => void
}

export function registerCompatibleStoreTools(
  registry: CompatibleToolRegistry,
  definitions: readonly ToolDefinition[],
): ToolDefinition[] {
  const registered: ToolDefinition[] = []

  for (const definition of definitions) {
    if (registry.get(definition.name) !== undefined) continue
    registry.register(definition)
    registered.push(definition)
  }

  return registered
}
