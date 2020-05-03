const KEY = "state";
// helper function
export const retrieveState = () => {
  try {
    const context = localStorage.getItem(KEY);
    return context ? JSON.parse(context) : null;
  } catch (e) {
    console.error("Can not use localStorage", e.message);
    return null;
  }
};

export const preserveState = (key, state) => {
  try {
    const data = retrieveState();
    if (state) {
      const newData = data ? { ...data, [key]: state } : { [key]: state };
      console.log(newData);
      localStorage.setItem(KEY, JSON.stringify(newData));
    }
  } catch (error) {
    console.error("Can not save to localStorage", error.message);
    return null;
  }
};
