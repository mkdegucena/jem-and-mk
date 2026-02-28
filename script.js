let siteConfig = {}
const overlay = document.getElementById('password-overlay')
const scrollContainer = document.getElementById('main-scroll')
const floatingBtn = document.getElementById('c-rsvp-btn')
let countdownInterval

// --- Setup & Fetch ---
async function loadConfig() {
	try {
		const response = await fetch('config.json')
		siteConfig = await response.json()

		populateContent()
		document.getElementById('loader').style.display = 'none'
		initAuth()
	} catch (error) {
		console.error('Failed to load config.json:', error)
		document.getElementById('loader').innerHTML = "<p style='color:red;'>Error loading website configuration.</p>"
	}
}

// --- DOM Injection ---
function populateContent() {
	const combinedNames = `${siteConfig.couple.brideName} & ${siteConfig.couple.groomName}`
	const shortNames = `${siteConfig.couple.brideName[0]} & ${siteConfig.couple.groomName[0]}`

	document.getElementById('c-pw-names').innerText = shortNames
	document.getElementById('c-hero-names').innerText = combinedNames
	document.getElementById('c-hero-invite').innerText = siteConfig.couple.inviteText
	document.getElementById('c-hero-img').src = siteConfig.couple.heroImage

	document.getElementById('c-quote-text').innerHTML = siteConfig.quote.text
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

	document.getElementById('c-contact-name').innerText = siteConfig.contact.coordinatorName
	document.getElementById('c-contact-email').innerText = siteConfig.contact.email
	document.getElementById('c-contact-email').href = `mailto:${siteConfig.contact.email}`

	const phoneEl = document.getElementById('c-contact-phone')
	if (siteConfig.contact.phoneLabel && siteConfig.contact.phoneValue) {
		phoneEl.innerText = siteConfig.contact.phoneLabel
		phoneEl.href = `tel:${siteConfig.contact.phoneValue}`
		phoneEl.style.display = 'block'
	}

	floatingBtn.href = siteConfig.links.rsvpUrl
}

// --- Auth ---
function initAuth() {
	if (sessionStorage.getItem('wedding_access') === 'true') {
		grantAccess()
	} else {
		overlay.style.display = 'flex'
	}
}

function checkPassword() {
	const input = document.getElementById('pw-input').value
	if (input.trim() === siteConfig.security.password) {
		sessionStorage.setItem('wedding_access', 'true')
		overlay.style.opacity = '0'
		setTimeout(() => {
			grantAccess()
		}, 800)
	} else {
		document.getElementById('pw-input').style.borderColor = 'red'
	}
}

function grantAccess() {
	overlay.style.display = 'none'
	initAnimations()
	startCountdown()

	floatingBtn.style.display = 'block'
	setTimeout(() => {
		floatingBtn.style.opacity = '1'
	}, 100)
}

// --- Observers & Animations ---
const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) entry.target.classList.add('active')
		})
	},
	{ root: scrollContainer, threshold: 0.2 },
)

function initAnimations() {
	document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
}

// --- Countdown ---
function startCountdown() {
	const target = new Date(siteConfig.countdown.targetDate).getTime()
	countdownInterval = setInterval(() => {
		const now = new Date().getTime()
		const d = target - now
		if (d > 0) {
			document.getElementById('days').innerText = String(Math.floor(d / (1000 * 60 * 60 * 24))).padStart(2, '0')
			document.getElementById('hours').innerText = String(
				Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
			).padStart(2, '0')
			document.getElementById('mins').innerText = String(
				Math.floor((d % (1000 * 60 * 60)) / (1000 * 60)),
			).padStart(2, '0')
			document.getElementById('secs').innerText = String(Math.floor((d % (1000 * 60)) / 1000)).padStart(2, '0')
		}
	}, 1000)
}

// --- Listeners ---
document.getElementById('pw-input').addEventListener('keypress', (e) => {
	if (e.key === 'Enter') checkPassword()
})

window.addEventListener('DOMContentLoaded', loadConfig)
