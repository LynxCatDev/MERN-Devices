'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useShallow } from 'zustand/react/shallow';
import { useUser } from '@/store/store';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Separator } from '../Separator/Separator';

import './AuthForm.scss';

export const AuthForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [profile, login, registration, error] = useUser(
    useShallow((state) => [
      state.profile,
      state.login,
      state.registration,
      state.error,
    ]),
  );
  const t = useTranslations('Auth');
  const { push } = useRouter();
  const pathname = usePathname();
  const isRegistrationPage = pathname?.includes('registration');
  const isLoginPage = pathname?.includes('login');
  const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const formTitle = () => {
    if (isRegistrationPage) {
      return t('create_account');
    } else {
      return t('login');
    }
  };

  const formik = useFormik<{
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
  }>({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role: 'user',
    },
    validationSchema: Yup.object({
      first_name: isRegistrationPage
        ? Yup.string()
            .required('First name is required')
            .max(16, 'First name must not be more than 16 characters')
        : Yup.string().max(
            16,
            'First name must not be more than 16 characters',
          ),
      last_name: isRegistrationPage
        ? Yup.string()
            .required('Last name is required')
            .max(16, 'Last name must not be more than 16 characters')
        : Yup.string().max(16, 'Last name must not be more than 16 characters'),
      email: Yup.string()
        .required('Email is required')
        .email('Invalid email address'),
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must have at least 6 characters')
        .max(18, 'Max password length is 18')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        ),
    }),
    onSubmit: (values: any) => {
      if (isSubmitting) return;

      setIsSubmitting(true);
      try {
        console.log(values, 'form values');
        if (isRegistrationPage) {
          registration(values);
        } else {
          login(values.email.trim().toLowerCase(), values.password);
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const buttonEnabled = !emailValidation.test(formik.values.email);

  useEffect(() => {
    if (profile?.user || profile?.accessToken) {
      push(`/`);
    }
  }, [profile?.user, profile?.accessToken]);

  return (
    <div className="login">
      <div className="login--description">
        <Link href="/">
          <Icon type="logo" width="60" height="60" />
        </Link>

        <h1>{formTitle()}</h1>
      </div>
      <form
        className="login--form"
        autoComplete="off"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        {isRegistrationPage && (
          <>
            <div className="login--input-wrapper">
              <span>
                <Icon type="write" width="24" height="24" />
              </span>

              <input
                id="first_name"
                name="first_name"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.first_name}
                onBlur={formik.handleBlur}
                placeholder={t('first_name')}
                autoComplete="off"
              />
            </div>
            {formik.submitCount > 0 && formik.errors.first_name && (
              <div className="error-message">{formik.errors.first_name}</div>
            )}

            <div className="login--input-wrapper">
              <span>
                <Icon type="write" width="24" height="24" />
              </span>

              <input
                id="last_name"
                name="last_name"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.last_name}
                onBlur={formik.handleBlur}
                placeholder={t('last_name')}
                autoComplete="off"
              />
            </div>
            {formik.submitCount > 0 && formik.errors.last_name && (
              <div className="error-message">{formik.errors.last_name}</div>
            )}
          </>
        )}

        <div className="login--input-wrapper">
          <span>
            <Icon type="email" width="24" height="24" />
          </span>

          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            onBlur={formik.handleBlur}
            placeholder={t('email')}
            autoComplete="email"
            spellCheck="false"
          />
        </div>

        {formik.submitCount > 0 && formik.errors.email && (
          <div className="error-message">{formik.errors.email}</div>
        )}

        <div className="login--input-wrapper">
          <span>
            <Icon type="password-lock" width="24" height="24" />
          </span>

          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('password')}
            onChange={formik.handleChange}
            value={formik.values.password}
            onBlur={formik.handleBlur}
            autoComplete="off"
          />

          <button
            type="button"
            className="password-see-btn"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            <Icon type={showPassword ? 'password-seen' : 'password-hide'} />
          </button>
        </div>

        {formik.submitCount > 0 && formik.errors.password && (
          <div className="error-message">{formik.errors.password}</div>
        )}

        <div className="login--form--actions">
          {isLoginPage && (
            <Button size="auto" className="forgot-password">
              Forgot password?
            </Button>
          )}

          {error && <div className="error-message">{error}</div>}

          <Button
            generalType="submit"
            size="auth"
            className="login--btn"
            disabled={buttonEnabled || isSubmitting}
            isLoading={isSubmitting}
          >
            {isLoginPage ? t('login') : t('register')}
          </Button>
        </div>

        <Separator />

        <div className="login--already">
          <span className="login--already--title">
            {isRegistrationPage ? t('have_account') : t('no_account')}
          </span>

          {isRegistrationPage ? (
            <Link href="/auth/login">{t('login')}</Link>
          ) : (
            <Link href="/auth/registration">{t('register')}</Link>
          )}
        </div>
      </form>
    </div>
  );
};
