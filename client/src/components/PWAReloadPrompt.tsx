import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useRegisterSW } from 'virtual:pwa-register/react'

const TOAST_ID = 'pwa-update'

/**
 * Registers the service worker and, when a new version has been precached,
 * surfaces a toast prompting the user to reload into the fresh build.
 * Rendered once at the app root.
 */
export const PWAReloadPrompt = () => {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      // Poll for a new deployment every hour while the app stays open.
      if (registration) {
        setInterval(() => registration.update(), 60 * 60 * 1000)
      }
    },
  })

  useEffect(() => {
    if (!needRefresh) return

    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span className="text-sm">A new version is available.</span>
          <button
            onClick={() => {
              toast.dismiss(t.id)
              updateServiceWorker(true)
            }}
            className="rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Reload
          </button>
        </div>
      ),
      { id: TOAST_ID, duration: Infinity }
    )
  }, [needRefresh, updateServiceWorker])

  return null
}
