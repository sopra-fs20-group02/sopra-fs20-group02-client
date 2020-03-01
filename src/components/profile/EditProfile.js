import React from "react";
import {withRouter} from "react-router-dom";
import {BaseContainer} from "../../helpers/layout";
import styled from "styled-components";
import {Button} from "../../views/design/Button";
import {api, handleError} from "../../helpers/api";
import  { Redirect } from 'react-router-dom'

const Container = styled.div`
  text-align: center;
  border-radius: 6px;
  border: 1px solid #ffffff26;
  padding-bottom: 10px;
  padding-top: 10px;
  width: 100%;
`;

const Form = styled.div`
  padding: 10px 0px 20px 0px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 1.0);
  }
  height: 35px;
  width: 90%;
  padding-left: 15px;
  border: none;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const UpdateButton = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  margin-left: 10px;
  padding: 6px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  width: 80px;
  height: 35px;
  border: none;
  border-radius: 20px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: #66baff;
  transition: all 0.3s ease;
`;

export class EditProfile extends React.Component {

  constructor() {
    super();
    this.state = {
      newUsername: null,
      newBirthDate: null
    };
  }

  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }

  async updateUser(){
    try {
      const requestBody = JSON.stringify({
        username: this.state.newUsername,
        birthDate: this.state.newBirthDate
      });
      const response = await api.put(`/users/${this.props.id}`,requestBody);

      window.location.reload();

    } catch (error) {
      alert(`Something went wrong during updating the birthdate: \n${handleError(error)}`);
    }

  }

  render() {
    return (
      <Container>
        <p>
          <InputField
            placeholder="New Username"
            onChange={e => {
              this.handleInputChange('newUsername', e.target.value);
            }}
          />
        </p>
        <p>
          <InputField
            placeholder="New Birthdate (dd/MM/yyyy)"
            onChange={e => {
              this.handleInputChange('newBirthDate', e.target.value);
            }}
          />
        </p>
        <UpdateButton
          disabled={!this.state.newBirthDate && !this.state.newUsername}
          onClick={() => {
            this.updateUser();
          }}
        >
          Update
        </UpdateButton>
      </Container>
    )
  }
}

export default withRouter(EditProfile);