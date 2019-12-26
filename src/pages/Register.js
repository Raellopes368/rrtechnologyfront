import React, { Component, Fragment } from "react";
import "./Register.css";
import Upload from "../components/Upload";
import { uniqueId } from "lodash";
import Preview from "../components/Preview";
import filesize from "filesize";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import api from "../services/api";

class Register extends Component {
  state = {
    uploadFile: [],
    newName: "",
    newEmail: "",
    newPass: "",
    newError: "",
    newBio: ""
  };
  handleUpload = file => {
    const uploadFile = file.map(arquivo => ({
      arquivo,
      id: uniqueId(),
      name: arquivo.name,
      path: arquivo.path,
      size: arquivo.size,
      type: arquivo.type,
      readableSize: filesize(arquivo.size),
      preview: URL.createObjectURL(arquivo),
      progress: 0,
      uploaded: false,
      error: false,
      url: null
    }));
    this.setState({ uploadFile });
    uploadFile.forEach(this.processUpload);
  };
  updateFile = (id, data) => {
    this.setState({
      uploadFile: this.state.uploadFile.map(upFile => {
        return id === upFile.id ? { ...upFile, ...data } : upFile;
      })
    });
  };
  processUpload = async file => {
    const dataPost = new FormData();
    dataPost.append("file", file.arquivo, file.name);
    api
      .post("posts", dataPost, {
        onUploadProgress: e => {
          const progress = parseInt(Math.round((e.loaded * 100) / e.total));

          this.updateFile(file.id, {
            progress
          });
        }
      })
      .then(response => {
        this.updateFile(file.id, {
          uploaded: true,
          url: response.data.url
        });
      })
      .catch(err => {
        this.updateFile(file.id, {
          error: true
        });
      });
  };

  handleSubmint = async () => {
    const { newName: name, newPass: pass, newEmail: email } = this.state;
    const { newBio : bio } = this.state.newBio.length > 0 ? this.state:""; 
    if (name && email && pass) {
      const { data } = await this.props.Create({
        variables: {
          name,
          email,
          pass,
          image: !this.state.uploadFile[0]
            ? "padrao"
            : this.state.uploadFile[0].url,
          bio  
        }
      });
      if (data.createUser.error) {
        this.setState({ newError: data.createUser.error });
      } else {
        const { token } = data.createUser;
        const { user } = data.createUser;
        localStorage.setItem("token", `Bearer ${token}`);

        this.props.history.push(`/home/${user.id}`);
      }
    } else {
      this.setState({ newError: "Preencha todos os campos!" });
    }
  };
  render() {
    const { uploadFile } = this.state;
    const error = this.state.newError;
    return (
      <Fragment>
        <div className="container">
          <div className="form">
            <div className="images">
              <Upload onUpload={this.handleUpload} />
              {!!uploadFile.length && <Preview file={uploadFile} />}
            </div>
            {error !== "" ? <p className="error">{error}</p> : <p></p>}
            <input
              placeholder="Nome de Usuário"
              required
              onChange={e => this.setState({ newName: e.target.value })}
            />
            <textarea
              className="bio"
              placeholder="Bio status"
              rows={4}
              cols={50}
              onChange={e => this.setState({ newBio: e.target.value })}
            />
            <input
              placeholder="Seu Email"
              type="email"
              required
              onChange={e => this.setState({ newEmail: e.target.value })}
            />
            <input
              placeholder="Sua Senha"
              required
              type="password"
              onChange={e => this.setState({ newPass: e.target.value })}
            />
            <input
              type="button"
              value="Cadastrar"
              className="buttom"
              onClick={this.handleSubmint}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}
const CreateUser = gql`
  mutation createUser(
    $name: String!
    $email: String!
    $pass: String!
    $image: String!
    $bio:String
  ) {
    createUser(name: $name, email: $email, pass: $pass, image: $image,bio:$bio) {
      user {
        id
      }
      error
      token
    }
  }
`;
export default graphql(CreateUser, { name: "Create" })(Register);
