import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from '@remix-run/react'
import LargeLogo from '~/components/Icons/LargeLogo'
import SmallLogo from '~/components/Icons/SmallLogo'
import LoadingSpinner from '~/components/Icons/LoadingSpinner'

// Icons matching Meet's exact implementation
function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  )
}

function VideoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 8-6 4 6 4V8Z"/>
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>
    </svg>
  )
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  )
}

function getFormattedDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export default function HomeScreen() {
  const [inputValue, setInputValue] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  function JoinCall(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!inputValue.trim()) {
      setErrorMessage('Please enter your session code to join.')
      return
    }

    setIsLoading(true)

    const validSessionLinkRegex = /^https?:\/\/[^/]+\/[\w-]+$/
    const codeOnlyRegex = /^[\w-]+$/
    let participantId = inputValue.trim()

    if (validSessionLinkRegex.test(inputValue)) {
      const url = new URL(inputValue)
      participantId = url.pathname.replace('/', '')
    } else if (!codeOnlyRegex.test(inputValue)) {
      setIsLoading(false)
      setErrorMessage('Invalid session code. Please check and try again.')
      return
    }

    navigate(`/${participantId}`)
  }

  return (
    <>
      {/* Header - matches Meet's Header exactly */}
      <header className="sticky top-0 z-[60] flex items-center justify-between border-b border-meet_grey_6 bg-white px-4 py-2 h-16 shadow-sm">
        <nav className="mx-auto flex w-full max-w-[1440px] items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="hidden md:inline-block">
              <LargeLogo />
            </Link>
            <Link to="/" className="inline-block md:hidden">
              <SmallLogo />
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-xs md:text-base font-normal text-meet_text_2 capitalize tracking-wide">
              {getFormattedDate()}
            </p>
          </div>
        </nav>
      </header>

      {/* Main content - matches Meet's HomeScreen exactly */}
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-meet_primary_2/30 via-meet_grey_5 to-meet_primary_2/20 overflow-hidden relative flex flex-col">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-meet_primary_1/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-meet_secondary_2/10 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-meet_primary_2/40 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />

        {/* Main Content - positioned slightly above center */}
        <div className="relative z-10 flex items-start justify-center flex-1 px-4 pt-8 md:pt-12 lg:pt-16 pb-6">
          <div className="w-full max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center md:gap-12 lg:gap-20">

              {/* Left Side - Hero Text (Desktop) */}
              <div className="hidden md:block md:flex-1">
                <h1 className="text-4xl lg:text-5xl font-semibold text-meet_text_1 mb-6 leading-tight tracking-tight">
                  Your Space for
                  <span className="text-meet_primary_1 block whitespace-nowrap">Meaningful Care</span>
                </h1>
                <p className="text-lg text-meet_text_2 mb-8 leading-relaxed font-light">
                  A calm, private environment designed for your comfort.
                  Connect securely from anywhere, with nothing to download.
                </p>

                {/* Feature list */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-meet_primary_2 flex items-center justify-center text-meet_primary_1">
                      <LockIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-meet_text_1">Private & Secure</p>
                      <p className="text-sm text-meet_text_2 font-light">End-to-end encryption keeps your sessions confidential</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-meet_primary_2 flex items-center justify-center text-meet_primary_1">
                      <VideoIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-meet_text_1">Clear Communication</p>
                      <p className="text-sm text-meet_text_2 font-light">High-quality video and audio for natural conversations</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-meet_primary_2 flex items-center justify-center text-meet_primary_1">
                      <UsersIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-meet_text_1">Simple & Accessible</p>
                      <p className="text-sm text-meet_text_2 font-light">Join instantly from any device, no setup needed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Join Card */}
              <div className="w-full md:w-[420px] lg:w-[460px]">
                <div className="border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden rounded-2xl">
                  {/* Green Header */}
                  <div className="bg-gradient-to-br from-meet_primary_1 to-meet_secondary_1 p-6 md:p-8 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10">
                      <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <VideoIcon className="w-7 h-7 md:w-8 md:h-8" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-semibold mb-1 tracking-tight">
                        Ready to Connect
                      </h2>
                      <p className="text-white/80 text-sm font-light">
                        Enter your session code below
                      </p>
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    <form onSubmit={JoinCall} className="space-y-5">
                      <div>
                        <label htmlFor="sessionCode" className="block text-sm font-medium text-meet_text_1 mb-2.5">
                          Session Code
                        </label>
                        <input
                          id="sessionCode"
                          type="text"
                          className={`w-full px-4 py-3.5 text-base rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                            errorMessage
                              ? 'border-meet_error_1 bg-meet_error_2/10'
                              : 'border-meet_grey_6 bg-white hover:border-meet_grey_6/80 focus:border-meet_primary_1 focus:ring-4 focus:ring-meet_primary_1/10'
                          }`}
                          placeholder="Enter code or paste link"
                          value={inputValue}
                          onChange={(e) => {
                            setInputValue(e.target.value)
                            setErrorMessage('')
                          }}
                          disabled={isLoading}
                        />
                        {errorMessage && (
                          <p className="mt-2 text-sm text-meet_error_1">{errorMessage}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-meet_primary_1 hover:bg-meet_secondary_1 text-white py-4 h-auto text-base font-medium rounded-xl shadow-lg shadow-meet_primary_1/25 transition-all duration-300 hover:shadow-xl hover:shadow-meet_primary_1/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <LoadingSpinner size={20} color="white" />
                            Connecting...
                          </span>
                        ) : (
                          'Join Session'
                        )}
                      </button>
                    </form>

                    {/* Security badges */}
                    <div className="mt-6 pt-5 border-t border-meet_grey_6/60">
                      <div className="flex items-center justify-center gap-3 text-xs text-meet_text_2">
                        <div className="flex items-center gap-1.5">
                          <CheckCircleIcon className="w-4 h-4 text-meet_primary_1" />
                          <span>HIPAA Compliant</span>
                        </div>
                        <span className="w-1 h-1 rounded-full bg-meet_grey_6"></span>
                        <div className="flex items-center gap-1.5">
                          <CheckCircleIcon className="w-4 h-4 text-meet_primary_1" />
                          <span>End-to-End Encrypted</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile-only feature pills */}
                <div className="md:hidden mt-6 flex flex-wrap justify-center gap-2">
                  <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs text-meet_text_2 shadow-sm">
                    <ShieldCheckIcon className="w-3.5 h-3.5 text-meet_primary_1" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs text-meet_text_2 shadow-sm">
                    <VideoIcon className="w-3.5 h-3.5 text-meet_primary_1" />
                    <span>HD Video</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs text-meet_text_2 shadow-sm">
                    <LockIcon className="w-3.5 h-3.5 text-meet_primary_1" />
                    <span>Private</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Branding footer */}
        <div className="relative z-10 text-center py-4 text-xs text-meet_text_2">
          Powered by TranqBay Health | Need support?{' '}
          <a href="mailto:support@tranqbay.health" className="text-meet_primary_1 hover:underline">
            support@tranqbay.health
          </a>
        </div>
      </div>
    </>
  )
}
