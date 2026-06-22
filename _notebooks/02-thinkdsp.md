---
title: "Think DSP: Digital Signal Processing in Python"
permalink: /notebooks/thinkdsp/
excerpt: "Notes on Allen Downey's top-down introduction to digital signal processing — sounds, harmonics, transforms, filtering, and LTI systems."
last_modified_at: 2026-06-22T00:00:00+00:00
field: signal-processing
authors: "Downey"
toc: true
toc_label: Table of Contents
---

## About This Book

*Think DSP* is an introduction to Digital Signal Processing in Python by Allen B. Downey. The book takes a top-down, programming-based approach: by the end of the first chapter you can decompose a sound into its harmonics, modify them, and generate new sounds.

**Read online**: [greenteapress.com/thinkdsp/](https://greenteapress.com/thinkdsp/)
**GitHub**: [AllenDowney/ThinkDSP](https://github.com/AllenDowney/ThinkDSP)

---

## Chapter 1. Sounds and Signals

### Periodic Signals

A signal is a function that maps time to amplitude. A periodic signal repeats with period $$T$$. The simplest periodic signal is a sinusoid:

$$y(t) = A \sin(2\pi f t + \phi)$$

where $$A$$ is amplitude, $$f$$ is frequency (Hz), and $$\phi$$ is phase offset.

### Spectral Decomposition

Any periodic signal can be decomposed into a sum of sinusoids at harmonic frequencies (multiples of the fundamental). The **spectrum** shows the amplitude and phase at each frequency. A `Spectrum` object maps from frequency to a complex number whose magnitude is the amplitude and angle is the phase.

### Signals

The book's `Signal` class represents a function $$f(t)$$. Subclasses include `Sinusoid`, `SquareSignal`, `TriangleSignal`, and `SawtoothSignal`. A `Wave` is a signal sampled at discrete time points.

### Waves

A `Wave` is an array of samples plus metadata (framerate, start time, duration). Operations include:
- **Apodization** (windowing) — tapering the ends to reduce spectral leakage.
- **Addition** — mixing two waves.
- **Slicing** — extracting a time segment.

---

## Chapter 2. Harmonics

### Triangle Waves

The triangle wave has only odd harmonics whose amplitudes decay like $$1/k^2$$ (faster than a square wave's $$1/k$$). This gives it a mellower sound. The book builds a triangle wave by summing sinusoids and compares the synthetic result to an analytic triangle wave.

The key insight: the shape of the waveform in time determines which harmonics are present and how strong they are.

### Square Waves

A square wave contains odd harmonics with amplitude proportional to $$1/k$$. The jaggedness of the reconstruction with a finite number of harmonics illustrates Gibbs phenomenon.

---

## Chapter 3. Non-Periodic Signals

### Spectrum of a Chirp

A chirp (frequency sweep) is non-periodic — its frequency changes over time. The spectrum of a chirp is spread over a range of frequencies rather than concentrated at discrete peaks.

### Spectrogram

The spectrogram (a time-frequency representation) chops the signal into short windows and computes the spectrum of each window. This reveals how frequency content changes over time. The trade-off: shorter windows give better time resolution but worse frequency resolution (uncertainty principle).

---

## Chapter 4. Noise

### Types of Noise

- **White noise** — equal power at all frequencies; uncorrelated samples.
- **Pink noise** — power density proportional to $$1/f$$; correlated, sounds natural.
- **Brownian noise** — power density proportional to $$1/f^2$$; integrated white noise.

### Autocorrelation of Noise

White noise has an autocorrelation function that is zero everywhere except at lag 0 (no correlation between samples). Pink and Brownian noise show positive autocorrelation at small lags.

### Integrating Noise

Integrating white noise produces Brownian noise. The resulting signal is smoother and has more energy at low frequencies.

---

## Chapter 5. Autocorrelation

### Definition

The autocorrelation of a signal measures similarity between the signal and a delayed copy of itself:

$$R(\tau) = \sum_t x[t] \cdot x[t+\tau]$$

### Periodic Signals

For a periodic signal, the autocorrelation peaks at lags equal to the period and its multiples. This provides a way to estimate the fundamental frequency of a sound without computing the spectrum.

### Pitch Perception

The human auditory system uses autocorrelation-like mechanisms to perceive pitch. Two signals with the same autocorrelation (even if they have different spectra) are perceived as having the same pitch.

---

## Chapter 6. Discrete Cosine Transform (DCT)

### DCT Basics

The DCT expresses a finite sequence of data points as a sum of cosine functions oscillating at different frequencies. Unlike the DFT, the DCT uses only real-valued cosine functions.

### DCT vs. DFT

- DCT implicitly assumes even symmetry at the boundaries, reducing discontinuities.
- DCT has better energy compaction — most of the signal energy is concentrated in a few low-frequency coefficients.
- The DCT is widely used in image and audio compression (JPEG, MP3).

### Applications

The MP3 codec uses a modified DCT (MDCT) for its filter bank. The DCT's energy compaction property makes it ideal for lossy compression: the low-energy high-frequency coefficients can be discarded with minimal perceptual impact.

---

## Chapter 7. Discrete Fourier Transform (DFT)

### From DCT to DFT

The DFT uses both sine and cosine basis functions, producing complex coefficients that encode both amplitude and phase. The DFT of a real signal has Hermitian symmetry: $$X[-k] = X[k]^*$$.

### The DFT Matrix

The DFT can be written as a matrix multiplication:

$$X[k] = \sum_{n=0}^{N-1} x[n] \cdot e^{-j 2\pi k n / N}$$

The naive implementation is $$O(N^2)$$, motivating the Fast Fourier Transform (FFT).

### FFT

The FFT (Cooley–Tukey algorithm) exploits symmetry and periodicity of the complex exponential to compute the DFT in $$O(N \log N)$$. It recursively divides the sequence into even and odd indices.

### Zero Padding

Adding zeros to the end of a signal before taking the DFT yields a finer frequency grid (interpolation in the frequency domain) but does not increase resolution — the underlying information is unchanged.

---

## Chapter 8. Filtering and Convolution

### Convolution

The convolution of two signals $$x$$ and $$y$$ is defined as:

$$(x * y)[n] = \sum_{k} x[k] \cdot y[n-k]$$

**Key result**: convolution in the time domain is multiplication in the frequency domain (and vice versa).

### Filters

A filter is a system that selectively passes or attenuates frequency components:
- **Low-pass** — passes low frequencies, attenuates high.
- **High-pass** — passes high frequencies, attenuates low.
- **Band-pass** — passes a range of frequencies.

### FIR Filters

Finite Impulse Response (FIR) filters are implemented by convolving the input signal with a finite-length kernel (the filter taps). Simple to design and always stable.

### IIR Filters

Infinite Impulse Response (IIR) filters use feedback — the output depends on past outputs. They can achieve sharper cutoffs with fewer coefficients but can be unstable.

---

## Chapter 9. Differentiation and Integration

### Differentiation in Continuous and Discrete Time

The derivative of a signal corresponds to multiplying its spectrum by $$j 2\pi f$$. In discrete time, differentiation is approximated by finite differences (e.g., $$x[n] - x[n-1]$$), which acts as a high-pass filter.

### Integration

Integration corresponds to dividing the spectrum by $$j 2\pi f$$ and acts as a low-pass filter. The cumulative sum in discrete time approximates integration, equivalent to a filter with feedback (an IIR filter).

### Applications

- **Edge detection** — derivative highlights rapid changes.
- **Envelope detection** — integrating (smoothing) the rectified signal extracts the amplitude envelope.
- **EMG and ECG processing** — differentiation and integration are used to identify features in biomedical signals.

---

## Chapter 10. LTI Systems

### Linearity and Time Invariance

A system is **linear** if scaling and adding inputs produces correspondingly scaled and added outputs. It is **time-invariant** if shifting the input shifts the output by the same amount. LTI systems are fully characterised by their impulse response.

### Impulse Response and Transfer Function

- **Impulse response** $$h[n]$$ — the output when the input is a unit impulse.
- **Transfer function** $$H(f)$$ — the Fourier transform of the impulse response. The output spectrum is $$Y(f) = H(f) \cdot X(f)$$.

### Difference Equations

LTI systems can be described by linear constant-coefficient difference equations. The system function (Z-transform) reveals poles and zeros, which determine stability and frequency response.

### Stability

A system is stable if its impulse response decays to zero — equivalently, all poles of the transfer function lie inside the unit circle in the Z-plane.

---

## Chapter 11. Modulation and Sampling

### Amplitude Modulation (AM)

Multiplying a carrier signal by a modulating signal shifts the spectrum of the modulator to the carrier frequency. AM radio uses this principle: the audio signal is modulated onto a high-frequency carrier.

### Frequency Modulation (FM)

Varying the frequency of the carrier in proportion to the modulating signal. FM is more resistant to noise than AM because information is encoded in zero-crossings rather than amplitude.

### Sampling

The **Nyquist–Shannon sampling theorem**: a signal can be perfectly reconstructed from samples taken at a rate greater than twice its highest frequency component. Frequencies above half the sampling rate are aliased — they appear as lower frequencies in the sampled signal.

### Aliasing

When a signal contains frequencies above the Nyquist frequency, they are folded back into the baseband, producing spurious components. Anti-aliasing filters (low-pass, applied before sampling) prevent this.

### Quantisation

Mapping continuous amplitudes to discrete levels introduces quantisation noise. More bits per sample means lower quantisation noise (about 6 dB per bit).

---

## Reflection

Think DSP's top-down, code-first approach is effective: you write code that generates and analyses sounds before encountering the underlying maths. The book covers the essential DSP canon — Fourier analysis, filtering, LTI systems, sampling — while keeping the Python implementation practical. The Jupyter notebook format means every figure is reproducible and every exercise is executable. For a programmer new to signal processing, this is one of the gentlest and most rewarding entry points available.
