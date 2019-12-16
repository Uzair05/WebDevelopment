import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import $ from 'jquery';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName:"",
      userId:"",
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.LoadFriends = this.LoadFriends.bind(this);
    this.LoadAlbum = this.LoadAlbum.bind(this);
    this.LoadPicture = this.LoadPicture.bind(this);
    this.ZoomPicture = this.ZoomPicture.bind(this);
    this.crossZoom = this.crossZoom.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.handleDisplayLike = this.handleDisplayLike.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

handleLogout(){
  $.ajax({
    url: ("http://localhost:3002/logout"),
    type: "GET",
    dataType: 'json',
    success: function(data) {
      /*On Success*/
    }.bind(this),
      error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
      }.bind(this)
  });
}
handleLogin(myUserName,myUserPassword){
  var newLoginAttempt = {
    "username":myUserName,
    "password":myUserPassword
  }
  $.ajax({
    url: ("http://localhost:3002/login"),
    type: "POST",
    data: newLoginAttempt,
    dataType: 'json',
    success: function(data) {
      /*On Success*/
    }.bind(this),
      error: function (xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
      }.bind(this)
  });
}

 render(){
    return (
      <div id="wrapper">
        <h1 className="HeaderSpace">iAlbum</h1>
        <LoginBar
          handleLogin = {this.handleLogin}
          handleLogout = {this.handleLogout}
        />
        <FriendsList
          LoadFriends = {this.LoadFriends}
          LoadAlbum = {this.LoadAlbum}
        />
        <AlbumSpace
          LoadPicture = {this.LoadPicture}
          ZoomPicture = {this.ZoomPicture}
          crossZoom = {this.crossZoom}
          handleDelete = {this.handleDelete}
          handleLike = {this.handleLike}
          handleDisplayLike = {this.handleDisplayLike}
          handleUpload = {this.handleUpload}
        />
      </div>
    );
  }
}

class AlbumSpace extends React.Component{
  constructor(props) {
    super(props);
    this.LoadPicture = this.LoadPicture.bind(this);
    this.ZoomPicture = this.ZoomPicture.bind(this);
    this.crossZoom = this.crossZoom.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.handleDisplayLike = this.handleDisplayLike.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }



  render(){
    return(

    );
  }
}

class FriendsList extends React.Component{
  constructor(props) {
    super(props);
    this.LoadFriends = this.LoadFriends.bind(this);
    this.LoadAlbum = this.LoadAlbum.bind(this);
  }



  render(){
    return(

    );
  }
}

class LoginBar extends React.Component{
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }
  handleLogin(e){
    e.preventDefault(e);
    var text_Name = document.getElementById("MyUserName").value;
    var text_Pass = document.getElementById("MyUserPassword").value;
    document.getElementsByClassName("LogoutBar").style.visibility = visible;
    document.getElementsByClassName("LoginBar").style.visibility = hidden;
    this.props.handleLogin(text_Name,text_Pass);
  }
  handleLogout(e){
    e.preventDefault(e);
    document.getElementsByClassName("LogoutBar").style.visibility = hidden;
    document.getElementsByClassName("LoginBar").style.visibility = visible;
    this.props.handleLogout();
  }
  render(){
    return(
      <div className="LoginBar">
        <input type="submit" value="Login" onClick={this.handleLogin}>
        Password: <input type="text" name="MyUserPassword" id="MyUserPassword">
        UserName: <input type="text" name="MyUserName" id="MyUserName">
      </div>
      <div className="LogoutBar">
        <input type="submit" value="Logout" onClick={this.handleLogout}>
      </div>
    );
  }
}




export default App;
