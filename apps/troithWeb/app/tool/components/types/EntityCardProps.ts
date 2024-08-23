export type EntityCardProps<Entity> = {
  entity: Entity
  onSelect: (entity: Entity) => void
  isSelected?: boolean
}
