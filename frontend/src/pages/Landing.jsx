import { Button, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledGrid = styled(Grid)(({ theme }) => ({
    height: '90vh',
    backgroundColor: theme.palette.background.default,
}));

const LeftGrid = styled(Grid)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const RightGrid = styled(Grid)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
}));

const Title = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    fontSize: '3rem',
    margin: theme.spacing(2),
}));

const Subtitle = styled(Typography)(({ theme }) => ({
    fontSize: '1.5rem',
    margin: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(2),
    backgroundColor: "#000"
}));

function Landing() {
    var images = [
       //add example images
    ]
    return (
        <StyledGrid container>
            <LeftGrid item xs={12} md={6}>
                <img src={images[2]} height={500}alt="QR CODE IMAGE" />
            </LeftGrid>
            <RightGrid item xs={12} md={6}>
                <Title variant="h1">AI QR Code Generator</Title>
                <Subtitle variant="h4">
                    Create stunning and unique QR codes with the power of AI
                </Subtitle>
                <StyledButton variant="contained" color="primary" size="large">
                    Generate Now
                </StyledButton>
            </RightGrid>
        </StyledGrid>
    )
}

export default Landing