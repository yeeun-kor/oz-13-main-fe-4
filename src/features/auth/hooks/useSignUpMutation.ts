import { useMutation } from '@tanstack/react-query';
import { signUp } from '../api/auth';
import { useLogInMutation } from './useLogInMutation';

export const useSignUpMutation = () => {
  //자동로그인을 위해, 로그인 호출 뮤테이션 가져와야함
  const loginMutation = useLogInMutation();
  // return 잊지마
  return useMutation({
    mutationFn: signUp,
    onSuccess(data, variables) {
      //회원가입 성공 -> 자동로그인
      // loginMutation의 setAuth호출하게 됨.
      loginMutation.mutate({
        email: variables.email,
        password: variables.password,
        is_auto_login: false, // 회원가입 후 자동로그인은 자동로그인 체크 안함
      });
    },
  });
};
