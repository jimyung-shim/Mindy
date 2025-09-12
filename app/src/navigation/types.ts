import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
};

export type AppTabParamList = {
    HomeTab: undefined;
    ChatListTab: undefined;
    ReserveTab: undefined;
    MypageTab: undefined;
    PersonaSelect: undefined;
};

export type AppStackParamList = {
    Tabs: NavigatorScreenParams<AppTabParamList> | undefined;
    PersonaSelect: undefined;
    Chat: {conversationId: string};
    Survey: { draftId: string };
    SurveyList: undefined;
};

export type RootStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
    App: NavigatorScreenParams<AppStackParamList>;
};