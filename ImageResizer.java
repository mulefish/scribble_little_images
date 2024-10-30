import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import javax.imageio.ImageIO;

public class ImageResizer {

    public static void main(String[] args) {
        String inputDirPath = "C:\\Users\\squar\\tutorials\\scribble_little_images\\static\\images";
        String outputDirPath = "C:\\Users\\squar\\tutorials\\scribble_little_images\\static\\small_images";

        // Ensure the output directory exists
        File outputDir = new File(outputDirPath);
        if (!outputDir.exists()) {
            outputDir.mkdirs();
        }

        // Process each .png file in the input directory
        File inputDir = new File(inputDirPath);
        File[] files = inputDir.listFiles((dir, name) -> name.toLowerCase().endsWith(".png"));

        if (files != null) {
            for (File file : files) {
                String fileName = file.getName();
                String outputImagePath = outputDirPath + File.separator + fileName;

                try {
                    System.out.println("READING: " + file.getAbsolutePath());

                    // Load the original image
                    BufferedImage originalImage = ImageIO.read(file);

                    // Resize the image to 28x28
                    BufferedImage resizedImage = new BufferedImage(28, 28, BufferedImage.TYPE_INT_ARGB);
                    Graphics2D g = resizedImage.createGraphics();
                    g.drawImage(originalImage, 0, 0, 28, 28, null);
                    g.dispose();

                    // Convert to grayscale
                    for (int y = 0; y < resizedImage.getHeight(); y++) {
                        for (int x = 0; x < resizedImage.getWidth(); x++) {
                            int rgb = resizedImage.getRGB(x, y);

                            // Extract the color components
                            int alpha = (rgb >> 24) & 0xff;
                            int red = (rgb >> 16) & 0xff;
                            int green = (rgb >> 8) & 0xff;
                            int blue = rgb & 0xff;

                            // Calculate the average to get grayscale value
                            int gray = (red + green + blue) / 3;

                            // Reassemble the grayscale color
                            int grayscale = (alpha << 24) | (gray << 16) | (gray << 8) | gray;
                            resizedImage.setRGB(x, y, grayscale);
                        }
                    }

                    System.out.println("WRITE: " + outputImagePath);

                    // Save the grayscale, resized image
                    ImageIO.write(resizedImage, "png", new File(outputImagePath));
                    System.out.println("Resized and grayscale image saved to " + outputImagePath);

                } catch (Exception e) {
                    System.err.println("Error processing image " + fileName + ": " + e.getMessage());
                }
            }
        } else {
            System.err.println("No PNG files found in the directory: " + inputDirPath);
        }
    }
}

