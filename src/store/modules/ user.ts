export default {
  namespaced: true,
  state: () => ({
    foo: "bar",
  }),
  getters: {
    twoBars: (state: Record<string, any>) => state.foo.repeat(2),
  },
};
