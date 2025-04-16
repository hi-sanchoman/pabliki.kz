// Types for database models

// Action types for activity log
export type ActionType =
  | 'save_link'
  | 'delete_link'
  | 'update_link'
  | 'add_tag'
  | 'remove_tag'
  | 'create_collection'
  | 'add_to_collection'
  | 'search'
  | 'visit_link';
