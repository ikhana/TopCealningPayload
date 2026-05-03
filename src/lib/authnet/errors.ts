export class AuthNetError extends Error {
  responseCode: string
  responseText: string
  avsResultCode?: string
  cvvResultCode?: string

  constructor(params: {
    message: string
    responseCode: string
    responseText: string
    avsResultCode?: string
    cvvResultCode?: string
  }) {
    super(params.message)
    this.name = 'AuthNetError'
    this.responseCode = params.responseCode
    this.responseText = params.responseText
    this.avsResultCode = params.avsResultCode
    this.cvvResultCode = params.cvvResultCode
  }
}

export class AuthNetDeclinedError extends AuthNetError {
  constructor(responseText: string, avsResultCode?: string, cvvResultCode?: string) {
    super({
      message: `Card declined: ${responseText}`,
      responseCode: '2',
      responseText,
      avsResultCode,
      cvvResultCode,
    })
    this.name = 'AuthNetDeclinedError'
  }
}

export class AuthNetAvsError extends AuthNetDeclinedError {
  constructor(avsCode: string) {
    super(`AVS mismatch (code: ${avsCode})`, avsCode)
    this.name = 'AuthNetAvsError'
  }
}

export class AuthNetCvvError extends AuthNetDeclinedError {
  constructor(cvvCode: string) {
    super(`CVV mismatch (code: ${cvvCode})`, undefined, cvvCode)
    this.name = 'AuthNetCvvError'
  }
}
