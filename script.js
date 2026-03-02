let siteConfig = {}
const overlay = document.getElementById('password-overlay')
const scrollContainer = document.getElementById('main-scroll')
const floatingBtn = document.getElementById('c-rsvp-btn')
const aboutModal = document.getElementById('about-modal')
const giftModal = document.getElementById('gift-modal')
let countdownInterval
let galleryInterval
let isPastDeadline = false

async function loadConfig() {
	try {
		const response = await fetch('config.json')
		siteConfig = await response.json()
		populateContent()
		initAnalytics()
		document.getElementById('loader').style.display = 'none'
		initAuth()
	} catch (error) {
		console.error(error)
		document.getElementById('loader').innerHTML = "<p style='color:red;'>Error loading website configuration.</p>"
	}
}

function populateContent() {
	const combinedNames = `${siteConfig.couple.brideName} & ${siteConfig.couple.groomName}`
	const shortNames = `${siteConfig.couple.brideName[0]} & ${siteConfig.couple.groomName[0]}`

	document.getElementById('c-pw-names').innerText = shortNames
	document.getElementById('c-hero-names').innerText = combinedNames
	document.getElementById('c-hero-invite').innerText = siteConfig.couple.inviteText
	document.getElementById('c-hero-img').src = siteConfig.couple.heroImage

	if (siteConfig.ourStory) {
		if (siteConfig.ourStory.image) {
			document.getElementById('c-story-img').src = siteConfig.ourStory.image
		} else {
			document.getElementById('c-story-img').style.display = 'none'
		}
		const storyContainer = document.getElementById('c-story-text')
		storyContainer.innerHTML = ''
		siteConfig.ourStory.content.forEach((paragraph) => {
			const p = document.createElement('p')
			p.innerHTML = paragraph
			storyContainer.appendChild(p)
		})
	}

	document.getElementById('c-quote-text').innerHTML = siteConfig.quote.text
	document.getElementById('c-quote-verse').innerText = siteConfig.quote.verse
	if (siteConfig.quote.backgroundImage) {
		document.getElementById('c-quote-bg').style.backgroundImage = `url('${siteConfig.quote.backgroundImage}')`
	}

	document.getElementById('c-bride-name').innerText = siteConfig.couple.brideName
	if (siteConfig.couple.brideImage) document.getElementById('c-bride-img').src = siteConfig.couple.brideImage
	if (siteConfig.couple.brideHoverImage)
		document.getElementById('c-bride-hover-img').src = siteConfig.couple.brideHoverImage
	document.getElementById('c-groom-name').innerText = siteConfig.couple.groomName
	if (siteConfig.couple.groomImage) document.getElementById('c-groom-img').src = siteConfig.couple.groomImage
	if (siteConfig.couple.groomHoverImage)
		document.getElementById('c-groom-hover-img').src = siteConfig.couple.groomHoverImage

	document.getElementById('c-ceremony-date').innerHTML = siteConfig.ceremony.date
	document.getElementById('c-ceremony-loc').innerText = siteConfig.ceremony.locationName
	document.getElementById('c-ceremony-addr').innerText = siteConfig.ceremony.address
	document.getElementById('c-ceremony-time').innerText = siteConfig.ceremony.time
	document.getElementById('c-ceremony-sub').innerText = siteConfig.ceremony.subText
	document.getElementById('c-ceremony-map').src = siteConfig.ceremony.mapEmbedUrl

	document.getElementById('c-reception-date').innerHTML = siteConfig.reception.date
	document.getElementById('c-reception-loc').innerText = siteConfig.reception.locationName
	document.getElementById('c-reception-addr').innerText = siteConfig.reception.address
	document.getElementById('c-reception-time').innerText = siteConfig.reception.time
	document.getElementById('c-reception-sub').innerText = siteConfig.reception.subText
	document.getElementById('c-reception-map').src = siteConfig.reception.mapEmbedUrl

	if (siteConfig.contact.footerImage) {
		document.getElementById('c-final-bg').style.backgroundImage = `url('${siteConfig.contact.footerImage}')`
	}

	document.getElementById('c-contact-name').innerText = siteConfig.contact.coordinatorName
	document.getElementById('c-contact-email').innerText = siteConfig.contact.email
	document.getElementById('c-contact-email').href = `mailto:${siteConfig.contact.email}`

	const phoneEl = document.getElementById('c-contact-phone')
	if (siteConfig.contact.phoneLabel && siteConfig.contact.phoneValue) {
		phoneEl.innerText = siteConfig.contact.phoneLabel
		phoneEl.href = `tel:${siteConfig.contact.phoneValue}`
		phoneEl.style.display = 'block'
	}

	if (siteConfig.links) {
		floatingBtn.href = siteConfig.links.rsvpUrl || '#'
		document.getElementById('c-final-rsvp-btn').href = siteConfig.links.rsvpUrl || '#'
		document.getElementById('c-rsvp-deadline').innerText = siteConfig.links.rsvpDeadline || ''

		if (siteConfig.links.rsvpDeadlineDate) {
			const deadline = new Date(siteConfig.links.rsvpDeadlineDate).getTime()
			if (Date.now() > deadline) {
				isPastDeadline = true
			}
		}

		if (siteConfig.links.livestreamUrl) {
			const liveBtn = document.getElementById('c-livestream-btn')
			liveBtn.href = siteConfig.links.livestreamUrl
			liveBtn.style.display = 'inline-block'
		}
	}

	floatingBtn.addEventListener('click', trackRSVPClick)
	document.getElementById('c-final-rsvp-btn').addEventListener('click', trackRSVPClick)

	if (siteConfig.gallery && siteConfig.gallery.enabled) {
		document.getElementById('gallery-section').style.display = 'flex'
		const gridContainer = document.getElementById('c-gallery-grid-container')
		const gridSize = siteConfig.gallery.gridSize || 4

		gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`
		gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`

		if (siteConfig.gallery.sampleImages && siteConfig.gallery.sampleImages.length > 0) {
			const images = siteConfig.gallery.sampleImages
			const cells = []
			const totalCells = gridSize * gridSize

			for (let i = 0; i < totalCells; i++) {
				const cell = document.createElement('div')
				cell.className = 'gallery-cell'
				cell.style.backgroundImage = `url('${images[Math.floor(Math.random() * images.length)]}')`
				gridContainer.appendChild(cell)
				cells.push(cell)
			}
			if (images.length > 1) {
				galleryInterval = setInterval(() => {
					const numSwaps = Math.floor(Math.random() * (gridSize / 2)) + 1
					for (let i = 0; i < numSwaps; i++) {
						const randomCellIndex = Math.floor(Math.random() * cells.length)
						const randomImageIndex = Math.floor(Math.random() * images.length)
						cells[randomCellIndex].style.backgroundImage = `url('${images[randomImageIndex]}')`
					}
				}, 2500)
			}
		}
		if (siteConfig.gallery.albumUrl) {
			const albumBtn = document.getElementById('c-album-btn')
			albumBtn.href = siteConfig.gallery.albumUrl
			albumBtn.style.display = 'inline-block'
		}
	}

	if (siteConfig.palette && siteConfig.palette.length > 0) {
		const globalBar = document.getElementById('c-global-palette')
		const rsvpPalette = document.getElementById('c-rsvp-palette')
		document.getElementById('c-palette-container').style.display = 'block'
		siteConfig.palette.forEach((item) => {
			const barSlice = document.createElement('div')
			barSlice.style.background = item.color
			globalBar.appendChild(barSlice)
			const swatch = document.createElement('div')
			swatch.className = 'swatch'
			swatch.style.background = item.color
			swatch.setAttribute('data-tooltip', item.name)
			swatch.setAttribute('data-placement', 'top')
			rsvpPalette.appendChild(swatch)
		})
	}

	if (siteConfig.gifts && siteConfig.gifts.enabled) {
		document.getElementById('c-gift-link').style.display = 'inline-block'
		document.getElementById('m-gift-text').innerText = siteConfig.gifts.text
	}
}

function initAuth() {
	if (isPastDeadline) {
		applyAccessLevel('preview')
		return
	}
	const access = sessionStorage.getItem('wedding_access')
	if (access === 'full' || access === 'preview') {
		applyAccessLevel(access)
	} else {
		overlay.style.display = 'flex'
	}
}

function checkPassword() {
	const input = document.getElementById('pw-input').value
	if (input.trim() === siteConfig.security.password) {
		sessionStorage.setItem('wedding_access', 'full')
		overlay.style.opacity = '0'
		setTimeout(() => {
			applyAccessLevel('full')
		}, 800)
	} else {
		document.getElementById('pw-input').style.borderColor = 'red'
	}
}

function previewWebsite() {
	sessionStorage.setItem('wedding_access', 'preview')
	overlay.style.opacity = '0'
	setTimeout(() => {
		applyAccessLevel('preview')
	}, 800)
}

function applyAccessLevel(level) {
	overlay.style.display = 'none'
	initAnimations()
	startCountdown()

	const fcd = document.getElementById('floating-countdown')
	fcd.style.display = 'flex'

	if (level === 'full' && !isPastDeadline) {
		floatingBtn.style.display = 'block'
		document.getElementById('rsvp-block').style.display = 'block'
		setTimeout(() => {
			floatingBtn.style.opacity = '1'
			fcd.style.opacity = '1'
			fcd.style.transform = 'translateY(0)'
		}, 100)
	} else {
		floatingBtn.style.display = 'none'
		document.getElementById('rsvp-block').style.display = 'none'
		document.getElementById('c-preview-btn').style.display = 'none'
		setTimeout(() => {
			fcd.style.opacity = '1'
			fcd.style.transform = 'translateY(0)'
		}, 100)
	}
}

const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) entry.target.classList.add('active')
		})
	},
	{ root: scrollContainer, threshold: 0.2 },
)

const fcdObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			const fcd = document.getElementById('floating-countdown')
			if (fcd.style.display !== 'none') {
				if (entry.isIntersecting) {
					fcd.style.opacity = '0'
					fcd.style.transform = 'translateY(-20px)'
				} else {
					fcd.style.opacity = '1'
					fcd.style.transform = 'translateY(0)'
				}
			}
		})
	},
	{ root: scrollContainer, threshold: 0.1 },
)

function initAnimations() {
	document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
	const cdtSection = document.getElementById('countdown-section')
	if (cdtSection) fcdObserver.observe(cdtSection)
}

function startCountdown() {
	const target = new Date(siteConfig.countdown.targetDate).getTime()
	countdownInterval = setInterval(() => {
		const now = new Date().getTime()
		const d = target - now
		if (d > 0) {
			const dStr = String(Math.floor(d / (1000 * 60 * 60 * 24))).padStart(2, '0')
			const hStr = String(Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0')
			const mStr = String(Math.floor((d % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0')
			const sStr = String(Math.floor((d % (1000 * 60)) / 1000)).padStart(2, '0')

			document.getElementById('days').innerText = dStr
			document.getElementById('hours').innerText = hStr
			document.getElementById('mins').innerText = mStr
			document.getElementById('secs').innerText = sStr

			document.getElementById('f-days').innerText = dStr
			document.getElementById('f-hours').innerText = hStr
			document.getElementById('f-mins').innerText = mStr
			document.getElementById('f-secs').innerText = sStr
		}
	}, 1000)
}

function openAboutModal() {
	aboutModal.showModal()
	document.body.style.overflow = 'hidden'
}

function closeAboutModal() {
	aboutModal.close()
	document.body.style.overflow = 'auto'
}

aboutModal.addEventListener('click', (event) => {
	const rect = aboutModal.getBoundingClientRect()
	const isInDialog =
		rect.top <= event.clientY &&
		event.clientY <= rect.top + rect.height &&
		rect.left <= event.clientX &&
		event.clientX <= rect.left + rect.width
	if (!isInDialog) closeAboutModal()
})

function openGiftModal(e) {
	if (e) e.preventDefault()
	giftModal.showModal()
	document.body.style.overflow = 'hidden'
}

function closeGiftModal() {
	giftModal.close()
	document.body.style.overflow = 'auto'
}

giftModal.addEventListener('click', (event) => {
	const rect = giftModal.getBoundingClientRect()
	const isInDialog =
		rect.top <= event.clientY &&
		event.clientY <= rect.top + rect.height &&
		rect.left <= event.clientX &&
		event.clientX <= rect.left + rect.width
	if (!isInDialog) closeGiftModal()
})

document.getElementById('pw-input').addEventListener('keypress', (e) => {
	if (e.key === 'Enter') checkPassword()
})

window.addEventListener('DOMContentLoaded', loadConfig)

function initAnalytics() {
	if (siteConfig.analytics && siteConfig.analytics.googleAnalyticsId) {
		const gaId = siteConfig.analytics.googleAnalyticsId
		const scriptAsync = document.createElement('script')
		scriptAsync.async = true
		scriptAsync.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
		document.head.appendChild(scriptAsync)
		const scriptInit = document.createElement('script')
		scriptInit.innerHTML = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}');`
		document.head.appendChild(scriptInit)
	}
}

function trackRSVPClick() {
	if (typeof gtag === 'function') {
		gtag('event', 'rsvp_button_click', { event_category: 'Engagement', event_label: 'Guest Clicked RSVP' })
	}
}
