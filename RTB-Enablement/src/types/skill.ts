export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface QuickPrompt {
  id: string;
  icon: string;
  label: string;
  prompt: string;
}

export interface RTBSkill {
  name: string;
  description: string;
  quickPrompts: QuickPrompt[];
  restrictions: {
    roleTargetAudience: string;
  };
  interactions: {
    inputHandler: {
      placeholder: string;
      multilineSupport: boolean;
      multilineKeybinding?: string;
    };
  };
  ui: {
    theme: "dark" | "light";
    typography: {
      fontFamily: string;
      sizes: {
        heading: string;
        bodyText: string;
        label: string;
      };
    };
    colorScheme: {
      text: string;
      textSecondary: string;
      accent: string;
      accentLight: string;
      border: string;
      userMessage: string;
      aiMessage: string;
    };
    header: {
      logoBase64?: string;
      title: string;
      subtitle: string;
    };
    layout: {
      maxWidth: string;
      messageMaxWidth: {
        user: string;
        assistant: string;
      };
    };
  };
}
