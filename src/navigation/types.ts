// src/navigation/types.ts

export type RootStackParamList = {
    Onboarding: undefined;
    Login: undefined;
    Register: undefined;
    UserTabs: undefined;
    ProfessionalDetail: { professionalId: string };
    CreateProfessionalProfile: undefined;
    ProviderProfile: { providerId: string };
    ServiceDetail: { serviceId: string };
    Chat: { providerId: string; providerName: string };
    ProviderServices: undefined;
    AddService: { serviceId?: string; mode?: "edit" | "add" };
    AllCategoriesScreen: undefined;
    CategoryScreen: { categoryId: string; categoryName: string };
    CreateBookingScreen: { serviceId: string };
    AllServicesScreen: undefined;
    // Agrega aquí otras screens y sus params
  };

export type ProviderStackParamList = {
  ProviderServices: undefined;
  AddService: { serviceId?: string; mode?: "edit" | "add" };
  // ...otras screens
}

 