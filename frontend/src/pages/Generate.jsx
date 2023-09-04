import { useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, FormControl, Grid, LinearProgress } from '@mui/material';

import axios from 'axios'
import placeholder from "../assets/placeholder.png"
import { ImagePlaceholder } from '../components';

function Generate({handleNotifications}) {
  const [generatedQrCodeUrl, setGeneratedQrCodeUrl] = useState()
  const [loading, setLoading] = useState(false)

  const [qrCodeContent, setQrCodeContent] = useState("")
  const [prompt, setPrompt] = useState("")
  const [negativePrompt, setNegativePrompt] = useState()
  const [strength, setStrength] = useState(0.9)
  const [controlnetConditioningScale, setcontrolnetConditioningScale] = useState(1.3)
  const [guidanceScale, setGuidanceScale] = useState(7.5)

  const isqrCodeContentEmpty = qrCodeContent.trim() === '';
  const isPromptEmpty = prompt.trim() === '';

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true)

    let formData = new FormData()
    formData.append('qr_code_content', qrCodeContent)
    formData.append('prompt', prompt)
    formData.append('negative_prompt', negativePrompt)
    formData.append('strength', strength)
    formData.append('controlnet_conditioning_scale', controlnetConditioningScale)
    formData.append('guidance_scale', guidanceScale)
    axios
      .post('/predict', formData).then((res) => {
        // console.log(res)
        setLoading(false)
        setGeneratedQrCodeUrl(res.data)
      })
      .catch((err) => {
        setLoading(false)
        handleNotifications("An error occurred. Please try again later", "error")
        // console.log("ERROR OCCURRED")
      })
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="85vh" sx={{ margin: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box component="form" noValidate autoComplete="off">
            <FormControl fullWidth>
              <TextField
                id="qr-code-content"
                label="QR Code Content"
                onChange={(e) => setQrCodeContent(e.target.value)}
                error={isqrCodeContentEmpty}
                helperText={isqrCodeContentEmpty ? 'Text Field cannot be empty' : 'When scanned, where the QRCode will lead to'}
              />
              <TextField
                id="prompt"
                label="Prompt"
                multiline
                rows={4}
                sx={{ mb: 1 }}
                onChange={(e) => setPrompt(e.target.value)}
                error={isPromptEmpty}
                helperText={isPromptEmpty ? 'Prompt cannot be empty' : ''}
              />
              <TextField
                id="negative_prompt"
                label="Negative Prompt"
                value={"ugly, disfigured, low quality, blurry, nsfw"}
                sx={{ mb: 1 }}
                onChange={(e) => setNegativePrompt(e.target.value)}
              />
              <TextField
                id="strength"
                label="Strength(ADVANCED)"
                helperText="Between 0.8 - 1"
                value={strength}
                sx={{ mb: 1 }}
                onChange={(e) => setStrength(e.target.value)}
              />
              <TextField
                id="controlnet_conditioning_scale"
                label="Controlnet Conditioning Scale(ADVANCED)"
                helperText="Between 0.6-2.0"
                value={controlnetConditioningScale}
                sx={{ mb: 1 }}
                onChange={(e) => setcontrolnetConditioningScale(e.target.value)}
              />
              <TextField
                id="guidance_scale"
                label="Guidance Scale(ADVANCED)"
                helperText="Between 0 - 10"
                value={guidanceScale}
                sx={{ mb: 1 }}
                onChange={(e) => setGuidanceScale(e.target.value)}
              />
              <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ backgroundColor: "black" }}>
                Generate
              </Button>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={6}>
          {loading && <LinearProgress />}
          <Box display="flex" justifyContent="center">
            {
              generatedQrCodeUrl ?
                <img
                  alt="AI QR Code Art"
                  src={generatedQrCodeUrl || placeholder}
                  style={{ width: "100%", maxHeight: 500, objectFit: "contain" }}
                /> : <ImagePlaceholder />
            }
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Generate

//A picturesque house on a green well manicured lawn
//A forest view of rivers flowing with wild animals
//A desert sand dune with a view 3D
//a house with mechanical legs on the foundation, fine art, trending on artstation, smooth draw, sharp focus, digital art, bright colors, fine draw, no anomaly, cool style, horror.

