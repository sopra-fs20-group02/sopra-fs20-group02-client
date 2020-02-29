import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import { Spinner } from '../../views/design/Spinner';
import {EditProfile} from '../profile/EditProfile';

const Bold = styled.span`
  font-weight: 900;
  color: #06c4ff;
`;

const Info = styled.p`
  color: #8B0000;
  font-weight: 900;
`;
const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
  width: 500px;
`;

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 375px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 1.0);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class Profile extends React.Component {
  /**
   * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
   * The constructor for a React component is called before it is mounted (rendered).
   * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
   * These fields are then handled in the onChange() methods in the resp. InputFields
   */
  constructor() {
    super();
    this.state = {
      user: null,
      name: null,
      edit: false
    };
  }

  /**
   *  Every time the user enters something in the input field, the state gets updated.
   * @param key (the key of the state for identifying the field that needs to be updated)
   * @param value (the value that gets assigned to the identified state key)
   */
  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }

  /**
   * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
   * Initialization that requires DOM nodes should go here.
   * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
   * You may call setState() immediately in componentDidMount().
   * It will trigger an extra rendering, but it will happen before the browser updates the screen.
   */
  async componentDidMount() {
    const {id} = this.props.match.params;
    //this.setState({id:id});

    const response = await api.get(`/users/${id}`);

    this.setState({user: response.data});

    if(response.status === 200) {

    }
    else {
      this.props.history.push('/game');
    }

  }

  editUser() {
    this.setState({edit: !this.state.edit});
  }

  render (){
    return (
      <Container>
        {this.state.user ? (
          <div>
            <h2>Profile: {this.state.user.name}</h2>
            <p>Username: <Bold>{this.state.user.username}</Bold></p>
            <p>Status: <Bold>{this.state.user.status}</Bold></p>
            <p>Creationdate: <Bold>{this.state.user.creationDate}</Bold></p>
            <p>Birthdate: <Bold>{this.state.user.birthDate}</Bold></p>

            {(this.state.user.token === localStorage.getItem("token")) ? (
              <div>
                <ButtonContainer>
                  <Button
                    width="150px"
                    onClick={() => {
                      this.editUser()
                    }}
                  >
                    {!this.state.edit ? "Edit" : "Close"}
                  </Button>
                </ButtonContainer>
                {this.state.edit ? (
                    <div><EditProfile id={this.state.user.id}/></div>
                  ):(
                    <div></div>
                  )}
              </div>
            ):(
              <div>
                <Info>- not editable -</Info>
              </div>
            )}
          </div>
          ): (
            <div>
              <h2>user not found</h2>
            </div>
        )}
        <ButtonContainer>
          <Button
            width="150px"
            onClick={() => {
              this.props.history.push('/game');
            }}
          >
            Back
          </Button>
        </ButtonContainer>
      </Container>
    );
          }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Profile);