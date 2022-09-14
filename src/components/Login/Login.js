import React, { useState, useEffect, useReducer, useContext } from 'react'

import Card from '../UI/Card/Card'
import classes from './Login.module.css'
import Button from '../UI/Button/Button'
import AuthContext from '../../store/auth-context'

const emailReducer = (state, action) => {
  switch (action.type) {
    case 'USER_INPUT':
      return { value: action.val, isVaild: action.val.includes('@') }
    case 'INPUT_BLUR':
      return { value: state.value, isVaild: state.value.includes('@') }
    default:
      return { value: '', isVaild: false }
  }
}

const passwordReducer = (state, action) => {
  switch (action.type) {
    case 'USER_INPUT':
      return { value: action.val, isVaild: action.val.trim().length > 6 }
    case 'INPUT_BLUR':
      return { value: state.value, isVaild: state.value.trim().length > 6 }
    default:
      return { value: '', isVaild: false }
  }
}

const Login = () => {
  const [formIsValid, setFormIsValid] = useState(false)
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isVaild: null,
  })
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isVaild: null,
  })
  const ctx = useContext(AuthContext)

  useEffect(() => {
    const validation = setTimeout(() => {
      setFormIsValid(emailState.isVaild && passwordState.isVaild)
      console.log('active')
    }, 500)
    return () => {
      clearTimeout(validation)
    }
  }, [emailState.isVaild, passwordState.isVaild])

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: 'USER_INPUT', val: event.target.value })
  }

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: 'USER_INPUT', val: event.target.value })
  }

  const validateEmailHandler = () => {
    dispatchEmail({ type: 'INPUT_BLUR' })
  }

  const validatePasswordHandler = () => {
    dispatchPassword({ type: 'INPUT_BLUR' })
  }

  const submitHandler = (event) => {
    event.preventDefault()
    ctx.onLogin(emailState.value, passwordState.value)
  }

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isVaild === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isVaild === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button
            type="submit"
            className={classes.btn}
            disabled={!(emailState.isVaild && passwordState.isVaild)}
          >
            Login
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default Login
