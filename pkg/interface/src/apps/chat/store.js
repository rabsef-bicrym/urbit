import InitialReducer from '../../reducers/initial';
import ContactUpdateReducer from '../../reducers/contact-update';
import ChatUpdateReducer from '../../reducers/chat-update';
import InviteUpdateReducer from '../../reducers/invite-update';
import PermissionUpdateReducer from '../../reducers/permission-update';
import MetadataReducer from '../../reducers/metadata-update';
import LocalReducer from '../../reducers/local';
import S3Reducer from '../../reducers/s3';

export default class Store {
  constructor() {
    this.state = this.initialState();

    this.initialReducer = new InitialReducer();
    this.permissionUpdateReducer = new PermissionUpdateReducer();
    this.contactUpdateReducer = new ContactUpdateReducer();
    this.chatUpdateReducer = new ChatUpdateReducer();
    this.inviteUpdateReducer = new InviteUpdateReducer();
    this.metadataReducer = new MetadataReducer();
    this.localReducer = new LocalReducer();
    this.s3Reducer = new S3Reducer();
    this.setState = () => {};
  }

  initialState() {
    return {
      inbox: {},
      chatSynced: null,
      contacts: {},
      permissions: {},
      invites: {},
      associations: {
        chat: {},
        contacts: {}
      },
      sidebarShown: true,
      pendingMessages: new Map([]),
      chatInitialized: false,
      s3: {}
    };
  }

  setStateHandler(setState) {
    this.setState = setState;
  }

  clear() {
    this.handleEvent({
      data: { clear: true }
    });
  }

  handleEvent(data) {
    let json = data.data;

    if ('clear' in json && json.clear) {
      this.setState(this.initialState());
      return;
    }

    this.initialReducer.reduce(json, this.state);
    this.permissionUpdateReducer.reduce(json, this.state);
    this.contactUpdateReducer.reduce(json, this.state);
    this.chatUpdateReducer.reduce(json, this.state);
    this.inviteUpdateReducer.reduce(json, this.state);
    this.metadataReducer.reduce(json, this.state);
    this.localReducer.reduce(json, this.state);
    this.s3Reducer.reduce(json, this.state);

    this.setState(this.state);
  }
}

