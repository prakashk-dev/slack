const KEY = "state";

// helper function
export const retrieveState = () => {
  try {
    const context = sessionStorage.getItem(KEY);
    return context ? JSON.parse(context) : null;
  } catch (e) {
    console.error("Can not use sessionStorage", e.message);
    return null;
  }
};

export const preserveState = (key, state) => {
  try {
    const data = retrieveState();
    if (state) {
      const newData = data ? { ...data, [key]: state } : { [key]: state };
      console.log(newData);
      sessionStorage.setItem(KEY, JSON.stringify(newData));
    }
  } catch (error) {
    console.error("Can not save to sessionStorage", error.message);
    return null;
  }
};
