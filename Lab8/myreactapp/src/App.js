import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import $ from 'jquery';

class ContactPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortCounter: 1,
      contacts: [],
      displayContact:{'name':'','tel':'','email':''},
    };
    this.handleDisplayInfo = this.handleDisplayInfo.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleTelChange = this.handleTelChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleAddOrUpdateSubmit = this.handleAddOrUpdateSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSortList = this.handleSortList.bind(this);
  }

  newContactName: '';
  newContactTel: '';
  newContactEmail: '';

  handleSortList() {
    var x = this.state.sortCounter;
    this.setState({
      sortCounter: (x + 1)
    });
    let data = this.state.contacts;
    if ((x+1)%2 === 0) {
      for(let i=0;i<data.length;++i){
        for(let m=0;m<(data.length-1);++m){
          if (data[m].name > data[m+1].name){
            let xor = data[m];
            data[m] = data[m+1];
            data[m+1] = xor;
          }
        }
      }
    }else{
      for(let i=0;i<data.length;++i){
        for(let m=0;m<(data.length-1);++m){
          if (data[m].name < data[m+1].name){
            let xor = data[m];
            data[m] = data[m+1];
            data[m+1] = xor;
          }
        }
      }
    }
    this.setState({
      contacts: data
    });
  }


  handleNameChange(name) {
    this.setState({
      newContactName: name
    })
  }
  handleTelChange(tel) {
    this.setState({
      newContactTel: tel
    })
  }
  handleEmailChange(email) {
    this.setState({
      newContactEmail: email
    })
  }
  handleAddOrUpdateSubmit(e) {

       e.preventDefault();

      if (this.state.newContactName === '' || this.state.newContactTel === ''|| this.state.newContactEmail === '') {
           alert('Please fill in all fields');
      }
     else{
        var existingIndex = -1;

        for(var i=0; i < this.state.contacts.length; i++){
          if(this.state.newContactName === this.state.contacts[i].name){
            existingIndex = i;
            break;
          }
        }

        if(existingIndex >= 0){
          var existingContact = {
            "_id" : this.state.contacts[existingIndex]._id,
            "name" : this.state.newContactName,
            "tel" : this.state.newContactTel,
            "email" : this.state.newContactEmail
          }
          this.handleUpdate(existingIndex, existingContact);
        }else{
          $.post("http://localhost:3001/users/addContact",
          {
            "name" : this.state.newContactName,
            "tel" : this.state.newContactTel,
            "email" : this.state.newContactEmail
          },
          function(data, status){
            if (data.msg ===''){
              this.loadContacts();
              this.setState({
                newContactName: '',
                newContactTel: '',
                newContactEmail: ''
              });
            } else
              alert(data.msg);
          }.bind(this)
          );
        }
      }
    }
  handleDisplayInfo(contact){
    this.setState({
      displayContact:{'name':contact.name,'tel':contact.tel,'email':contact.email}
    });
  }
  componentDidMount() {
    this.loadContacts();
  }
  loadContacts() {
    $.ajax({
        url: "http://localhost:3001/users/contactList",
        dataType: 'json',
        success: function(data) {
          this.setState({
            contacts: data
          });
        }.bind(this),
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }.bind(this)
    });
  }

  handleUpdate(existingIndex, existingContact){

    var newCurrentContact = {
      "name":existingContact.name,
      "tel":existingContact.tel,
      "email":existingContact.email
    }
   $.ajax({
     url: ("http://localhost:3001/users/updateContact/" + existingContact._id),
     type: "PUT",
     data: newCurrentContact,
     dataType: 'json',
     success: function(data) {
       this.loadContacts();
       this.setState({
         newContactName: '',
         newContactTel: '',
         newContactEmail: ''
       });
     }.bind(this),
       error: function (xhr, ajaxOptions, thrownError) {
           alert(xhr.status);
           alert(thrownError);
       }.bind(this)
   });
 }

 handleDelete(e){
  e.preventDefault(e);
  var confirmation = window.confirm('Are you sure you want to delete this contact?');
  if(confirmation === true){
    var id = e.target.rel;
    $.ajax({
      type: 'DELETE',
      url: 'http://localhost:3001/users/deleteContact/' + id,
      dataType: 'json',
      success: function(response) {
        if (response.msg === '') {
          this.loadContacts();
        }
        else {
             alert('Error: ' + response.msg);
        }
      }.bind(this),
      error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      }.bind(this)
    });
  }
}

  render(){
    return(
      <div id="wrapper">
        <h1> Lab 8</h1>
        <p>Welcome to Lab 8.</p>
        <ContactInfo
          displayContact={this.state.displayContact}
        />
        <ContactList
          contacts={this.state.contacts}
          handleDisplayInfo={this.handleDisplayInfo}
          handleDelete={this.handleDelete}
          handleSortList={this.handleSortList}
        />
        <AddOrUpdateContactForm
          newContactName={this.state.newContactName}
          newContactTel={this.state.newContactTel}
          newContactEmail={this.state.newContactEmail}
          handleNameChange={this.handleNameChange}
          handleTelChange={this.handleTelChange}
          handleEmailChange={this.handleEmailChange}
          handleAddOrUpdateSubmit={this.handleAddOrUpdateSubmit}
          displayContact={this.state.displayContact}
        />


      </div>
    );
  }
}



class AddOrUpdateContactForm extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
       contacts: [],
       displayContact:{'name':'','tel':'','email':''},
     };
     this.handleNameChange = this.handleNameChange.bind(this);
     this.handleTelChange = this.handleTelChange.bind(this);
     this.handleEmailChange = this.handleEmailChange.bind(this);
     this.handleAddOrUpdateSubmit = this.handleAddOrUpdateSubmit.bind(this);
  }
  handleNameChange(e) {
    e.preventDefault(e);
    this.props.handleNameChange(e.target.value);
  }
  handleTelChange(e) {
    e.preventDefault(e);
    this.props.handleTelChange(e.target.value);
  }
  handleEmailChange(e) {
    e.preventDefault(e);
    this.props.handleEmailChange(e.target.value);
  }
  handleAddOrUpdateSubmit(e) {
    this.props.handleAddOrUpdateSubmit(e);
  }

  render() {
    return (
      <div id="addContact">
        <h2> Add/Update Contact </h2>
        <fieldset>
          <input className="input_text"
            type="text"
            placeholder = "Name"
            value={this.props.newContactName}
            onChange={this.handleNameChange}
          />
          <br/>

          <input className="input_text"
            type="text"
            placeholder = "Telephone"
            value={this.props.newContactTel}
            onChange={this.handleTelChange}
          />
          <br/>

          <input className="input_text"
            type="text"
            placeholder = "Email"
            value={this.props.newContactEmail}
            onChange={this.handleEmailChange}
          />
          <br/>

          <button className="myButton" onClick={this.handleAddOrUpdateSubmit}>Add/Update Contact</button>
        </fieldset>
      </div>
    );
  }
}


class ContactInfo extends React.Component{
  render() {
    const contact = this.props.displayContact;
    return (
      <div id="wrapper">
      <div id="contactInfo">
        <h2>Contact Info</h2>
        <table>
          <thead>
            <tr>
              <td>Name:</td>
              <td><input id='contactInfoName'  readonly value={contact.name}></input></td>
            </tr>
            <tr>
              <td>Telephone:</td>
              <td><input id='contactInfoTel'  readonly value={contact.tel}></input></td>
            </tr>
            <tr>
              <td>Email:</td>
              <td><input id='contactInfoEmail'  readonly value={contact.email}></input></td>
            </tr>
          </thead>
        </table>
      </div>
      </div>
    );
  }
}
class ContactList extends React.Component {
  constructor(props) {
    super(props);
    this.handleDisplayInfo = this.handleDisplayInfo.bind(this);
    this.handleSortList = this.handleSortList.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

  }

  handleDisplayInfo(contact){
    this.props.handleDisplayInfo(contact);
  }
  handleSortList(){
    this.props.handleSortList();
  }
  handleDelete(e){
    this.props.handleDelete(e);
  }

  render() {
    let rows = [];
    this.props.contacts.map((contact) => {
        rows.push(
          <ContactRow
            contact={contact}
            handleDisplayInfo={this.props.handleDisplayInfo}
            handleDelete = {this.props.handleDelete}
            handleSortList={this.props.handleSortList}
          />
        );
    });

    return (
      <div id="contactList">
      <h2> Contact List </h2>
      <table>
        <thead>
          <tr>
            <th>Name <span > <a id='sort' onClick={this.handleSortList}>sort</a> </span></th>
            <th>Delete?</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      </div>
    );
  }
}
class ContactRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleDisplayInfo = this.handleDisplayInfo.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDisplayInfo(e) {
    e.preventDefault(e);
    this.props.handleDisplayInfo(this.props.contact);
  }
  handleDelete(e){
    this.props.handleDelete(e);
  }

 render() {
    const contact = this.props.contact;

    return (
      <tr>
        <td><a href="" onClick={this.handleDisplayInfo} rel={contact.Name}>{contact.name}</a></td>
        <td><a href="" onClick={this.handleDelete} rel={contact._id}>delete</a></td>
      </tr>
    );
  }
}





export default ContactPage;
