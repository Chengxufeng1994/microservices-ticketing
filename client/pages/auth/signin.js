import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    await doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign In</h1>
      <div className="mb-3">
        <label className="form-label">Email Address</label>
        <input
          className="form-control"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        ></input>
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          value={password}
          className="form-control"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        ></input>
      </div>
      {errors}
      <button className="btn btn-primary">Sign In</button>
    </form>
  );
};
