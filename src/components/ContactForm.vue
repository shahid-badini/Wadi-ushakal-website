<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AppIcon from './ui/AppIcon.vue';
import { company, services } from '../data/site';

const mailto = `mailto:${company.email}`;
const serviceOptions = [
  ...services.map((s) => ({ value: s.id, label: s.title })),
  { value: 'other', label: 'Other / not sure yet' },
];

/*
 * Frontend-only form: nothing is sent to a server.
 * After validation it opens the visitor's email app with the request pre-filled, and says so.
 */
const form = reactive({ name: '', email: '', phone: '', company: '', service: '', message: '', website: '' });
const errors = reactive({ name: '', email: '', phone: '', service: '', message: '' });
const attempted = ref(false);
const sent = ref(false);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d\s()-]{7,20}$/;
const rules = {
  name: (v) => (v.length >= 2 ? '' : 'Please enter your full name.'),
  email: (v) => (!v ? 'Please enter your email address.' : EMAIL_RE.test(v) ? '' : 'Please enter a valid email address.'),
  phone: (v) => (!v || PHONE_RE.test(v) ? '' : 'Please enter a valid phone number.'),
  service: (v) => (v ? '' : 'Please choose a service or transport requirement.'),
  message: (v) => (v.length >= 10 ? '' : 'Please describe your requirement (at least 10 characters).'),
};

function validate(field) {
  errors[field] = rules[field](form[field].trim());
  return !errors[field];
}

function recheck(field) {
  if (attempted.value) validate(field);
}

// Arriving from a service card (/contact?service=heavy) pre-selects that service
const route = useRoute();
onMounted(() => {
  const s = route.query.service;
  if (typeof s === 'string' && serviceOptions.some((o) => o.value === s)) form.service = s;
});

function onSubmit() {
  attempted.value = true;
  sent.value = false;

  const invalid = Object.keys(rules).filter((f) => !validate(f));
  if (invalid.length) {
    document.getElementById(`cf-${invalid[0]}`)?.focus();
    return;
  }
  if (form.website) return; // honeypot filled — likely a bot

  const d = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()]));
  const service = serviceOptions.find((o) => o.value === d.service)?.label ?? '';
  const subject = `Transport request: ${service} — ${d.name}${d.company ? ` (${d.company})` : ''}`;
  const details = [
    `Full name: ${d.name}`,
    `Email: ${d.email}`,
    d.phone ? `Phone: ${d.phone}` : '',
    d.company ? `Company: ${d.company}` : '',
    `Service / requirement: ${service}`,
  ].filter(Boolean);
  const body = [d.message, '', '—', ...details].join('\n');

  sent.value = true;
  window.location.href = `${mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const inputs = [
  { key: 'name', label: 'Full Name', type: 'text', autocomplete: 'name', required: true },
  {
    key: 'email',
    label: 'Email Address',
    type: 'email',
    autocomplete: 'email',
    inputmode: 'email',
    required: true,
    placeholder: 'name@company.com',
  },
  { key: 'phone', label: 'Phone Number', type: 'tel', autocomplete: 'tel', inputmode: 'tel', placeholder: '+971' },
  { key: 'company', label: 'Company Name', type: 'text', autocomplete: 'organization' },
];
</script>

<template>
  <form class="contact-form" novalidate @submit.prevent="onSubmit">
    <div class="contact-form__head">
      <h2>Request a Quote</h2>
      <p>
        Fields marked <span aria-hidden="true">*</span><span class="visually-hidden">with an asterisk</span> are
        required.
      </p>
    </div>

    <div class="contact-form__grid">
      <div v-for="f in inputs" :key="f.key" class="field">
        <label :for="`cf-${f.key}`">
          {{ f.label }} <span v-if="f.required" aria-hidden="true">*</span>
          <em v-else>(optional)</em>
        </label>
        <input
          :id="`cf-${f.key}`"
          v-model="form[f.key]"
          :name="f.key"
          :type="f.type"
          :autocomplete="f.autocomplete"
          :inputmode="f.inputmode"
          :placeholder="f.placeholder"
          :required="f.required"
          :aria-invalid="errors[f.key] ? 'true' : 'false'"
          :aria-describedby="f.key in errors ? `cf-${f.key}-err` : undefined"
          @input="f.key in errors && recheck(f.key)"
          @blur="f.key in errors && recheck(f.key)"
        />
        <p v-if="f.key in errors" :id="`cf-${f.key}-err`" class="field__error" aria-live="polite">
          {{ errors[f.key] }}
        </p>
      </div>

      <div class="field field--full">
        <label for="cf-service">Service / Transport Requirement <span aria-hidden="true">*</span></label>
        <select
          id="cf-service"
          v-model="form.service"
          name="service"
          required
          :class="{ 'is-empty': !form.service }"
          :aria-invalid="errors.service ? 'true' : 'false'"
          aria-describedby="cf-service-err"
          @change="recheck('service')"
          @blur="recheck('service')"
        >
          <option value="" disabled>Select a service</option>
          <option v-for="o in serviceOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
        <p id="cf-service-err" class="field__error" aria-live="polite">{{ errors.service }}</p>
      </div>

      <div class="field field--full">
        <label for="cf-message">Message <span aria-hidden="true">*</span></label>
        <textarea
          id="cf-message"
          v-model="form.message"
          name="message"
          rows="5"
          required
          placeholder="Cargo type, pickup and delivery locations, preferred dates…"
          :aria-invalid="errors.message ? 'true' : 'false'"
          aria-describedby="cf-message-err"
          @input="recheck('message')"
          @blur="recheck('message')"
        ></textarea>
        <p id="cf-message-err" class="field__error" aria-live="polite">{{ errors.message }}</p>
      </div>
    </div>

    <!-- Honeypot for bots -->
    <div class="visually-hidden" aria-hidden="true">
      <label for="cf-website">Website</label>
      <input id="cf-website" v-model="form.website" name="website" type="text" tabindex="-1" autocomplete="off" />
    </div>

    <div class="contact-form__footer">
      <button class="btn btn--primary contact-form__submit" type="submit">
        Submit Request
        <AppIcon name="arrow" class="arrow" />
      </button>
      <p class="contact-form__note">
        Submitting opens your email app with your request ready to send to Wadi Nushakal. Nothing is sent from this
        website directly.
      </p>
    </div>

    <div class="contact-form__status" role="status" aria-live="polite" :hidden="!sent">
      <template v-if="sent">
        Your email app should now open with your request ready to send. If nothing opened, please email us at
        <a :href="mailto">{{ company.email }}</a> or call <a :href="company.phoneHref">{{ company.phoneDisplay }}</a>.
      </template>
    </div>
  </form>
</template>

<style scoped>
.contact-form {
  display: grid;
  gap: 1.5rem;
}

.contact-form__head h2 {
  font-size: clamp(1.35rem, 1.15rem + 0.6vw, 1.75rem);
}

.contact-form__head p {
  margin-top: 0.35rem;
  font-size: 0.875rem;
  color: var(--muted);
}

.contact-form__grid {
  display: grid;
  gap: 1.1rem 1rem;
}

@media (min-width: 600px) {
  .contact-form__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .field--full {
    grid-column: 1 / -1;
  }
}

.field {
  display: grid;
  gap: 0.45rem;
  align-content: start;
}

.field label {
  font-size: 0.85rem;
  font-weight: 650;
  color: var(--text-2);
}

.field label span {
  color: var(--brand-deep);
}

.field label em {
  font-style: normal;
  font-weight: 500;
  color: var(--muted);
}

.field input,
.field select,
.field textarea {
  width: 100%;
  min-height: 50px;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--line-2);
  background: var(--surface);
  font-size: 1rem;
  color: var(--text);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.field select {
  appearance: none;
  padding-right: 2.75rem;
  background: var(--surface)
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235b6675' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")
    no-repeat right 1rem center / 18px;
  cursor: pointer;
}

.field select.is-empty {
  color: #6b7684;
}

.field select option {
  color: var(--text);
}

.field textarea {
  resize: vertical;
  min-height: 150px;
  line-height: 1.55;
}

.field input::placeholder,
.field textarea::placeholder {
  color: #7a8492;
}

.field input:hover,
.field select:hover,
.field textarea:hover {
  border-color: rgba(15, 27, 42, 0.26);
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--brand);
  box-shadow: 0 0 0 4px var(--brand-soft);
}

.field [aria-invalid='true'] {
  border-color: #d64545;
}

.field__error {
  font-size: 0.8rem;
  font-weight: 550;
  color: var(--error);
}

.field__error:empty {
  display: none;
}

.contact-form__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.5rem;
}

.contact-form__submit {
  min-width: 210px;
}

.contact-form__note {
  flex: 1 1 16rem;
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--muted);
}

.contact-form__status {
  padding: 1rem 1.15rem;
  border-radius: 12px;
  font-size: 0.92rem;
  line-height: 1.55;
  color: var(--text);
  border: 1px solid rgba(74, 131, 184, 0.35);
  background: var(--brand-tint);
}

.contact-form__status a {
  color: var(--brand-deep);
  font-weight: 650;
  text-decoration: underline;
  text-underline-offset: 3px;
  word-break: break-word;
}

@media (max-width: 479px) {
  .contact-form__submit {
    width: 100%;
  }
}
</style>
