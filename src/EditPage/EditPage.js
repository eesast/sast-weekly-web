import React, { Component } from "react";
import { BackTop, Card, Menu, Icon, Input, Button, Modal } from "antd";
import hljs from "highlight.js";
import DOMPurify from "dompurify";
import Marked from "marked";
import DocumentTitle from "react-document-title";
import MultipleUpload from "../MultipleUpload/MultipleUpload";
import "./EditPage.css";
import "../github-markdown.css";
import "highlight.js/styles/github.css";

const { TextArea } = Input;
const confirm = Modal.confirm;

Marked.setOptions({
  highlight: code => {
    return hljs.highlightAuto(code).value;
  },
  sanitize: true,
  sanitizer: DOMPurify.sanitize
});

class EditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      alias: "",
      article: "",
      author: "",
      loading: true,
      md: {
        __html: ""
      },
      currentPage: "edit"
    };
    this.textareaRef = React.createRef();
  }

  handleMenuClick = e => {
    this.setState({
      currentPage: e.key
    });

    if (e.key === "preview") {
      this.setState({
        md: {
          __html: Marked(this.state.article)
        },
        loading: false
      });
    } else {
      this.setState({
        loading: true
      });
    }
  };

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleInsertPicture = picture => {
    const ref = this.textareaRef.current.textAreaRef;
    const selectionStart = ref.selectionStart;
    const selectionEnd = ref.selectionEnd;
    const article = this.state.article;

    this.setState({
      article:
        article.substring(0, selectionStart) +
        (selectionEnd === selectionStart ? "\n" : `\n\n`) +
        `![${picture.name}](${picture.url})\n\n` +
        article.substring(selectionEnd, article.length)
    });
  };

  handleRefresh = () => {
    sessionStorage.setItem("tmp-title", this.state.title);
    sessionStorage.setItem("tmp-alias", this.state.alias);
    sessionStorage.setItem("tmp-article", this.state.article);
  };

  handleSubmit = () => {
    confirm({
      title: "发布文章",
      content:
        "请在发布前预览 Markdown，确保文章完整可读。\n确定发布该文章吗？",
      onOk: () => {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          // clear sessionStorage
        }).catch(() => console.log("Oops errors!"));
      }
    });
  };

  componentDidMount = () => {
    this.setState({
      title: sessionStorage.getItem("tmp-title") || "",
      alias: sessionStorage.getItem("tmp-alias") || "",
      article: sessionStorage.getItem("tmp-article") || ""
    });
    window.addEventListener("beforeunload", this.handleRefresh);
  };

  componentWillUnmount = () => {
    window.removeEventListener("beforeunload", this.handleRefresh);
  };

  SubmitButton = () => {
    return (
      <Button
        className="submit-button"
        icon="upload"
        onClick={this.handleSubmit}
      >
        发布文章
      </Button>
    );
  };

  render() {
    return (
      <DocumentTitle
        title={
          "SAST Weekly | 编辑" +
          (this.state.title ? " - " + this.state.title : "")
        }
      >
        <div className="EditPage">
          <Menu
            style={{
              display: "flex",
              justifyContent: "space-between"
            }}
            onClick={this.handleMenuClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <Menu.Item key="edit">
              <Icon type="edit" />
              编辑
            </Menu.Item>
            <Menu.Item key="preview">
              <Icon type="file-markdown" />
              预览
            </Menu.Item>
          </Menu>
          {this.state.currentPage === "edit" && (
            <Card>
              <Input
                className="input"
                name="title"
                placeholder="标题，例：TensorFlow 初探"
                value={this.state.title}
                onChange={this.handleInputChange}
              />
              <Input
                className="input"
                name="alias"
                placeholder="英文标题，例：tensorflow-first-look"
                value={this.state.alias}
                onChange={this.handleInputChange}
              />
              <div className="input" style={{ display: "inline-block" }}>
                <MultipleUpload uploadPrompt="上传题图" maxUpload={1} />
              </div>
              <p>
                点击“插入图片”，会在当前光标处自动插入 Markdown
                语句以添加相应图片。
              </p>
              <p>
                在最终上传 Markdown
                文本前，请点击“删除图片图标”将未用到的图片删除，并提前预览确保展示效果。
              </p>
              <div className="input">
                <MultipleUpload afterUpload={this.handleInsertPicture} />
              </div>
              <TextArea
                style={{ resize: "none" }}
                name="article"
                rows={10}
                value={this.state.article}
                ref={this.textareaRef}
                onChange={this.handleInputChange}
              />
              <this.SubmitButton />
            </Card>
          )}
          {this.state.currentPage === "preview" && (
            <Card loading={this.state.loading} title={this.state.author}>
              <article className="markdown-body">
                <div dangerouslySetInnerHTML={this.state.md} />
              </article>
              <this.SubmitButton />
            </Card>
          )}
          <BackTop />
        </div>
      </DocumentTitle>
    );
  }
}

export default EditPage;
