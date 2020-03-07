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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

/**
 * This component is used for displaying the user's profile page
 */
class Profile extends React.Component {

  constructor() {
    super();
    this.state = {
      user: null,
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
    try {
      const {id} = this.props.match.params;

      const response = await api.get(`/users/${id}`);

      this.setState({user: response.data});

    } catch(error){
      if(error.response.status === 404){
        alert(error.response.data);
      }
      else {
        alert(`Something went wrong: \n${handleError(error)}`);
      }

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
            <h2>Profile</h2>
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
