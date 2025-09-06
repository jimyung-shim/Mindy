import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
};

export type AppTabParamList = {
    HomeTab: undefined;
    ChatTab: undefined;
    ReserveTab: undefined;
    MypageTab: undefined;
};

export type AppStackParamList = {
    Tabs: NavigatorScreenParams<AppTabParamList> | undefined;
    PersonaSelect: undefined;
};