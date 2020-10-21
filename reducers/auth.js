const initialData = {
    isLoading: false,
    isSignout: false,
    userToken: null,
  }

export default authReducer = (prevState = initialData, action) => {
    switch (action.type) {
    case 'RESTORE_TOKEN':
        return {
        ...prevState,
        isLoading: false,
        };
    case 'SIGN_IN':
        return {
        ...prevState,
        isSignout: false,
        isLoading: false,
        userToken: action.token,
        };
    case 'SIGN_OUT':
        return {
        ...prevState,
        isSignout: true,
        userToken: null
        };
    default:
        return prevState;
    }
}
