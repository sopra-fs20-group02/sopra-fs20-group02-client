/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.userId = null;
    this.username = null;
    this.token = null;
    this.status = null;
    this.password = null;
    this.creationDate = null;
    this.birthDate = null;
    Object.assign(this, data);
  }
}
export default User;
