import React from "react";
import {withRouter} from "react-router-dom";
import {BaseContainer} from "../../helpers/layout";
import styled from "styled-components";
import {Button} from "../../views/design/Button";
import {api, handleError} from "../../helpers/api";

const Container = styled.div`
  text-align: center;
  border-top: 1px dashed white;
  border-bottom: 1px dashed white;
  padding-bottom: 20px;
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
  width: 350px;
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
  background: #8B0000;
  transition: all 0.3s ease;
`;

export class EditProfile extends React.Component {

  constructor(props) {
    super(props);
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

  async updateUsername(){
    try {
      const requestBody = JSON.stringify({
        username: this.state.newUsername
      });
      const response = await api.put(`/users/${this.props.id}`,requestBody);


    } catch (error) {
      alert(`Something went wrong during updating the username: \n${handleError(error)}`);
    }
    //this.props.history.push(`/game/profile/${this.props.id}`);

  }

  async updateBirthDate(){
    try {
      const requestBody = JSON.stringify({
        birthDate: this.state.newBirthDate
      });
      const response = await api.put(`/users/${this.props.id}`,requestBody);

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
          <UpdateButton
            disabled={!this.state.newUsername}
            onClick={() => {
              this.updateUsername();
            }}
          >
            Update
          </UpdateButton>
        </p>
        <p>
          <InputField
            placeholder="New Birthdate (yyyy-MM-dd)"
            onChange={e => {
              this.handleInputChange('newBirthDate', e.target.value);
            }}
          />
          <UpdateButton
            disabled={!this.state.newBirthDate}
            onClick={() => {
              this.updateBirthDate();
            }}
          >
            Update
          </UpdateButton>
        </p>
      </Container>
    )
  }
}

export default withRouter(EditProfile);