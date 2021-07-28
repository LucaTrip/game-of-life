export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload?: M[Key];
      };
};

export enum Types {
  generateUserInputGrid = "generate_user_input_grid",
  clearAll = "clear_all",
}
