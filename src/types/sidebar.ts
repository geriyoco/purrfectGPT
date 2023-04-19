import { DrawerContentComponentProps } from "@react-navigation/drawer"

export type Screen = {
  id: string
  title: string
  edit: boolean
  folderId: string
  focus: boolean
}

export type Folder = {
  id: string
  title: string
  edit: boolean
  chatIds: string[]
  expand: boolean
}

export interface SidebarProps extends DrawerContentComponentProps {
  screens: Screen[]
  setScreens: (value: (prevState: Screen[]) => Screen[]) => void
}

export interface SidebarDrawerContentProps extends SidebarProps {
  folders: Folder[]
  setFolders: (value: (prevState: Folder[]) => Folder[]) => void
  addChat: () => void
  newChat: string
  setNewChat: (value: string) => void
  onChatTouch: (screenId: string) => void
}

export interface SidebarChatProps extends SidebarDrawerContentProps {
  screen: Screen
}

export interface SidebarFolderProps extends SidebarDrawerContentProps {
  folder: Folder
}
