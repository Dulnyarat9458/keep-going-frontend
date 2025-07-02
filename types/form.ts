export type inputError = {
  error: string
  field: string
}

export type HabitInput = {
  title: string;
  startDate?: Date;
};

export type SignUpFormInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignInFormInput = {
  email: string;
  password: string;
};

export type ResetPasswordFormInput = {
  password: string;
  confirmPassword: string;
};

export type ForgetPasswordFormInput = {
  email: string;
};
