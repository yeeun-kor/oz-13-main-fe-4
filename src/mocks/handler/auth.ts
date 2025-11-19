import { http, HttpResponse } from 'msw';
import {
  RequestEmailSendDTO,
  RequestEmailVerifyDTO,
  RequestLoginDTO,
  RequestNicknameValidateDTO,
  RequestPasswordChangeDTO,
  RequestProfileUpdateDTO,
  RequestSignUpDTO,
  ResponseLoginDTO,
  ResponseRefreshToken,
  ResponsetSignUpDTO,
} from '../../features/auth/types/auth';
import {
  emailVerificationCodes,
  mockPasswords,
  mockUsers,
  refreshTokenStore,
  usedNicknames,
  verifiedEmails,
} from '../data/user';

// src/mocks/handlers/auth.ts
export const authHandlers = [
  //-==================== 닉네임 중복 검증 ====================
  http.post('/api/auth/nickname/validate', async ({ request }) => {
    //사용자가 입력한 닉네임
    const { nickname } = (await request.json()) as RequestNicknameValidateDTO;
    //서버 닉네임과 사용자 닉네임 일치 확인
    if (usedNicknames.has(nickname)) {
      return HttpResponse.json(
        {
          success: false,
          statusCode: 400,
          error: {
            code: 'nickname_already_in_use',
            //json 키값으로 하고 value는 닉네임 중복 --> 이걸 토대로 title값으로 넘겨
            message: '이미 사용 중인 닉네임입니다',
          },
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      success: true,
      statusCode: 200,
      message: '닉네임 사용가능',
    });
  }),

  //-==================== 이메일 인증 ====================
  http.post('/api/auth/email/send', async ({ request }) => {
    const { email } = (await request.json()) as RequestEmailSendDTO;
    // 이미 인증된 이메일인지 확인
    if (verifiedEmails.has(email)) {
      return HttpResponse.json(
        {
          success: false,
          statusCode: 400,
          error: {
            code: 'email_already_verified',
            message: '이미 인증이 된 이메일',
          },
        },
        { status: 400 }
      );
    }

    // 이미 가입된 이메일인지 확인
    const existingUser = mockUsers.find((u) => u.email === email);
    if (existingUser) {
      return HttpResponse.json(
        {
          success: false,
          statusCode: 400,
          error: {
            code: 'email_duplicate',
            message: '이미 가입된 이메일입니다',
          },
        },
        { status: 400 }
      );
    }
    // 6자리 랜덤 코드 생성 -- 이거 우리가 ???
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    emailVerificationCodes.set(email, code);

    console.log(`📧 [MSW] 이메일 인증 코드 발송: ${email} -> ${code}`);

    //인증코드 발송 완료
    return HttpResponse.json({
      success: true,
      statusCode: 200,
      message: '인증 코드 발송완료',
    });
  }),

  //-==================== 이메일 인증 검증 ====================
  http.post('/api/auth/email/verify', async ({ request }) => {
    const { email, code } = (await request.json()) as RequestEmailVerifyDTO;
    //MSW임시 코드
    const saveCode = emailVerificationCodes.get(email);
    if (!saveCode || saveCode !== code) {
      return HttpResponse.json(
        {
          success: false,
          statusCode: 400,
          error: {
            code: 'code_invalid_or_expired',
            message: '코드 만료 또는 불일치',
          },
        },
        { status: 400 }
      );
    }
    //인증완료
    verifiedEmails.add(email);
    emailVerificationCodes.delete(email);
    return HttpResponse.json({
      success: true,
      statusCode: 200,
      message: '이메일 인증 완료',
    });
  }),

  //- ==================== 회원가입 ====================
  http.post('/api/auth/signup', async ({ request }) => {
    const body = (await request.json()) as RequestSignUpDTO;
    const newUser = {
      id: mockUsers.length + 1,
      email: body.email,
      name: body.name,
      nickname: body.nickname,
      gender: body.gender,
      age_group: body.age_group,
      is_verified: true,
      created_at: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    mockPasswords.set(body.email, body.password); //이메일에 맞는 비밀번호로 세팅
    usedNicknames.add(body.nickname);

    //회원가입 성공 응답
    return HttpResponse.json<ResponsetSignUpDTO>(
      {
        success: true,
        statusCode: 201,
        message: '회원가입 완료',
        data: {
          user: newUser,
        },
      },
      {
        status: 201,
      }
    );
  }),

  //- ==================== 로그인(할때마다 리프레쉬토큰 발급)====================
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password, is_auto_login } = (await request.json()) as RequestLoginDTO;
    //사용자 찾기
    const user = mockUsers.find((u) => u.email === email);

    if (!user) {
      return HttpResponse.json(
        {
          success: false,
          statusCode: 400,
          error: {
            code: 'email_not_found',
            message: '존재하지 않는 이메일입니다',
          },
        },
        { status: 400 }
      );
    }

    const savedPW = mockPasswords.get(email);
    if (savedPW !== password) {
      return HttpResponse.json(
        {
          success: false,
          statusCode: 401,
          error: {
            code: 'password_incorrect',
            message: '비밀번호가 일치하지 않습니다',
          },
        },
        { status: 401 }
      );
    }

    //토큰 생성
    const accessToken = 'mock-access-token-' + Date.now();
    const refreshToken = 'mock-refresh-token-' + Date.now();

    // 리프레시 토큰 저장 (이메일로 매핑)
    refreshTokenStore.set(email, refreshToken);

    // 자동 로그인 여부에 따라 쿠키 만료 시간 설정
    // 자동 로그인 ON: 30일 유지
    // 자동 로그인 OFF: 세션 쿠키 (브라우저 종료 시 삭제)
    const accessExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15분 후

    console.log(`🔐 [MSW] 로그인 성공: ${email}, 자동로그인: ${is_auto_login}`);
    console.log(`🔐 [MSW] Access Token: ${accessToken}`);
    console.log(`🔐 [MSW] Refresh Token (쿠키): ${refreshToken}`);

    // 쿠키 설정 생성
    const cookieOptions = is_auto_login
      ? `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${30 * 24 * 60 * 60}; Path=/` // 30일
      : `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/`; // 세션 쿠키 (Max-Age 없음 = 브라우저 종료 시 삭제)

    console.log(
      `🔐 [MSW] 쿠키 타입: ${is_auto_login ? '영구 쿠키 (30일)' : '세션 쿠키 (브라우저 종료 시 삭제)'}`
    );

    return HttpResponse.json<ResponseLoginDTO>(
      {
        success: true,
        statusCode: 200,
        message: '로그인 성공',
        data: {
          access: accessToken,
          access_expires_at: accessExpiresAt,
          is_auto_login: is_auto_login,
        },
      },
      {
        status: 200,
        headers: {
          // Refresh Token을 HttpOnly 쿠키로 설정
          'Set-Cookie': cookieOptions,
        },
      }
    );
  }),

  //- ==================== 리프레시 토큰으로 액세스 토큰 재발급 ====================
  http.post('/api/auth/refresh', ({ cookies }) => {
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
      return HttpResponse.json(
        {
          success: false,
          statusCode: 401,
          error: {
            code: 'refresh_token_missing',
            message: '리프레시 토큰이 없습니다',
          },
        },
        { status: 401 }
      );
    }

    // 리프레시 토큰으로 사용자 찾기
    const userEmail = Array.from(refreshTokenStore.entries()).find(
      ([_, token]) => token === refreshToken
    )?.[0];

    if (!userEmail) {
      return HttpResponse.json(
        {
          success: false,
          statusCode: 401,
          error: {
            code: 'refresh_token_invalid',
            message: '유효하지 않은 리프레시 토큰입니다',
          },
        },
        { status: 401 }
      );
    }

    // 새 액세스 토큰 생성
    const newAccessToken = 'mock-access-token-' + Date.now();
    const accessExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15분 후

    console.log(`🔄 [MSW] 리프레시 토큰으로 새 액세스 토큰 발급: ${userEmail}`);
    console.log(`🔄 [MSW] New Access Token: ${newAccessToken}`);

    return HttpResponse.json<ResponseRefreshToken>(
      {
        success: true,
        statusCode: 200,
        message: '액세스 토큰 재발급 성공',
        data: {
          access: newAccessToken,
        },
      },
      { status: 200 }
    );
  }),

  //- ==================== 로그아웃(토큰삭제) ====================
  http.post('/api/auth/logout', ({ cookies }) => {
    //쿠키로 저장된 리프레쉬 토큰 확인
    const refreshToken = cookies.refreshToken;
    if (refreshToken) {
      const userEmail = Array.from(refreshTokenStore.entries()).find(
        ([_, token]) => token === refreshToken
      )?.[0];

      if (userEmail) {
        refreshTokenStore.delete(userEmail);
        console.log(`🚪 [MSW] 로그아웃: ${userEmail}, 리프레시 토큰 삭제됨`);
      }
    }

    return new HttpResponse(null, {
      status: 204,
      headers: {
        //쿠키삭제
        'Set-Cookie': 'refreshToken=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/',
      },
    });
  }),

  //- ==================== 마이페이지 조회  ====================
  http.get('/api/auth/me', ({ request }) => {
    // Authorization 헤더에서 액세스 토큰 추출
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        {
          success: false,
          statusCode: 401,
          error: {
            code: 'unauthorized',
            message: '인증이 필요합니다',
          },
        },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace('Bearer ', '');

    // 액세스 토큰 검증 (실제로는 JWT 검증)
    if (!accessToken.startsWith('mock-access-token-')) {
      return HttpResponse.json(
        {
          success: false,
          statusCode: 401,
          error: {
            code: 'token_invalid',
            message: '유효하지 않은 토큰입니다',
          },
        },
        { status: 401 }
      );
    }

    // MSW에서는 첫 번째 사용자 반환 (실제로는 토큰에서 사용자 정보 추출)
    const user = mockUsers[0];

    if (!user) {
      return HttpResponse.json(
        {
          success: false,
          statusCode: 404,
          error: {
            code: 'user_not_found',
            message: '사용자를 찾을 수 없습니다',
          },
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      statusCode: 200,
      data: user,
    });
  }),

  //- ==================== 프로필 수정 ====================
  http.patch('/api/auth/profile', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        {
          success: false,
          statusCode: 401,
          error: {
            code: 'unauthorized',
            message: '인증이 필요합니다',
          },
        },
        { status: 401 }
      );
    }

    const body = (await request.json()) as RequestProfileUpdateDTO;

    // 닉네임 중복 확인
    if (body.nickname && usedNicknames.has(body.nickname)) {
      const currentUser = mockUsers[0]; // 현재 사용자
      // 자기 자신의 닉네임이 아닌 경우에만 중복 에러
      if (currentUser.nickname !== body.nickname) {
        return HttpResponse.json(
          {
            success: false,
            statusCode: 400,
            error: {
              code: 'nickname_duplicate',
              message: '이미 사용 중인 닉네임입니다',
            },
          },
          { status: 400 }
        );
      }
    }

    // 이메일 중복 확인
    if (body.email) {
      const existingUser = mockUsers.find((u) => u.email === body.email);
      const currentUser = mockUsers[0];
      if (existingUser && existingUser.id !== currentUser.id) {
        return HttpResponse.json(
          {
            success: false,
            statusCode: 400,
            error: {
              code: 'email_duplicate',
              message: '이미 사용 중인 이메일입니다',
            },
          },
          { status: 400 }
        );
      }
    }

    // 사용자 정보 업데이트
    const user = mockUsers[0];

    if (body.nickname) {
      usedNicknames.delete(user.nickname); // 기존 닉네임 제거
      user.nickname = body.nickname;
      usedNicknames.add(body.nickname); // 새 닉네임 추가
    }
    if (body.email) user.email = body.email;
    if (body.gender) user.gender = body.gender;
    if (body.age_group) user.age_group = body.age_group;

    console.log(`✏️ [MSW] 프로필 수정 완료:`, user);

    return HttpResponse.json({
      success: true,
      statusCode: 200,
      message: '프로필 수정 완료',
    });
  }),

  //- ==================== 비밀번호 변경 ====================
  http.patch('/api/auth/password', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        {
          success: false,
          statusCode: 401,
          error: {
            code: 'unauthorized',
            message: '인증이 필요합니다',
          },
        },
        { status: 401 }
      );
    }

    // 👇 try-catch로 감싸기
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error('❌ [MSW] JSON 파싱 실패:', error);
      return HttpResponse.json(
        {
          success: false,
          statusCode: 400,
          error: {
            code: 'invalid_request',
            message: '잘못된 요청입니다',
          },
        },
        { status: 400 }
      );
    }

    const { current_password, new_password, new_password_confirm } =
      body as RequestPasswordChangeDTO;

    const user = mockUsers[0];
    const savedPassword = mockPasswords.get(user.email);

    console.log('🔒 [MSW] 비밀번호 변경 요청:', {
      savedPassword,
      current_password,
      new_password,
    });

    // 1. 현재 비밀번호 확인
    if (savedPassword !== current_password) {
      return HttpResponse.json(
        {
          success: false,
          statusCode: 401,
          error: {
            code: 'password_incorrect',
            message: '비밀번호가 일치하지 않습니다',
          },
        },
        { status: 401 }
      );
    }

    // 2. 새 비밀번호 일치 확인
    if (new_password !== new_password_confirm) {
      return HttpResponse.json(
        {
          success: false,
          statusCode: 400,
          error: {
            code: 'passwords_not_match',
            message: '새 비밀번호가 일치하지 않습니다',
          },
        },
        { status: 400 }
      );
    }

    // 3. 새 비밀번호 == 현재 비밀번호 확인
    if (current_password === new_password) {
      return HttpResponse.json(
        {
          success: false,
          statusCode: 400,
          error: {
            code: 'password_same_as_old',
            message: '새 비밀번호는 현재 비밀번호와 달라야 합니다',
          },
        },
        { status: 400 }
      );
    }

    // 4. 비밀번호 형식 검증
    const passwordRegex = /^(?=.*[a-z])(?=.*[0-9])[a-z0-9]+$/;
    if (new_password.length < 6 || new_password.length > 20 || !passwordRegex.test(new_password)) {
      return HttpResponse.json(
        {
          success: false,
          statusCode: 400,
          error: {
            code: 'password_invalid',
            message: '비밀번호 형식이 올바르지 않습니다',
          },
        },
        { status: 400 }
      );
    }

    // 비밀번호 업데이트
    mockPasswords.set(user.email, new_password);

    console.log(`🔒 [MSW] 비밀번호 변경 완료: ${user.email}`);

    return HttpResponse.json({
      success: true,
      statusCode: 200,
      message: '비밀번호 변경 완료',
    });
  }),
];
