// src/navigation/types.ts

export type RootStackParamList = {
    // Auth
    Onboarding: undefined;
    Login: undefined;
    Register: undefined;
    CreateProfessionalProfile: undefined;

    // Main Navigators
    UserTabs: undefined;
    ProviderTabs: undefined;

    // Shared Screens
    ServiceDetail: { serviceId: string };
    Chat: { providerId: string; providerName: string };
    AllCategoriesScreen: undefined;
    CategoryScreen: { categoryId: string; categoryName: string };
    CreateBookingScreen: { serviceId: string };
    AllServicesScreen: undefined;
    ProfessionalDetail: { professionalId: string };
    ProviderProfile: { providerId: string };
    AddService: { serviceId?: string; mode?: "edit" | "add" };
};

export type UserTabParamList = {
    Home: undefined;
    Search: undefined;
    Professionals: undefined;
    Bookings: undefined;
    Profile: undefined;
};

export type ProviderTabParamList = {
    ProviderHome: undefined;
    ProviderServices: undefined;
    ProviderBookings: undefined;
    ProviderProfile: undefined;
};

export type ProviderStackParamList = {
  ProviderServices: undefined;
  AddService: { serviceId?: string; mode?: "edit" | "add" };
  // ...otras screens
}

 