import { NavigationProp, ParamListBase } from "@react-navigation/native";

export type Screen = {
  id: string;
  title: string;
  edit: boolean;
  folderId: string;
  focus:  boolean;
};

export type Folder = {
  id: string;
  title: string;
  edit: boolean;
  chats: string[];
  expand: boolean;
};

export interface SidebarBaseProps {
  screens: Screen[];
  setScreens: (value: (prevState: Screen[]) => Screen[]) => void;
  folders: Folder[];
  setFolders: (value: (prevState: Folder[]) => Folder[]) => void;
  setNewChat: (value: string) => void;
  addChat: () => void;
}

export interface SidebarChatEditModalProps extends SidebarBaseProps {
  onTouch: (screenId: string) => void;
  screen: Screen;
}

export interface SidebarChatProps extends SidebarBaseProps {
  onTouch: (screenId: string) => void;
  screen: Screen;
  navigation: NavigationProp<ParamListBase>;
  newChat: string;
}

export interface SidebarFolderEditModalProps extends SidebarBaseProps {
  folder: Folder;
}

export interface SidebarFolderProps extends SidebarBaseProps {
  onTouch: (screenId: string) => void;
  folder: Folder;
  navigation: NavigationProp<ParamListBase>;
  newChat: string;
}

export interface SidebarDrawerContent extends SidebarBaseProps {
  navigation: NavigationProp<ParamListBase>;
}