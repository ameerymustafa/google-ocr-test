using System;
using Google.Cloud.Vision.V1;

namespace GoogleOcrExample
{
    class Program
    {
        static void Main(string[] args)
        {
            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", "credentials.json");
            ImageAnnotatorClient client = ImageAnnotatorClient.Create();
            Image image = Image.FromFile("test-image.jpg");
            var response = client.DetectText(image);

            if (response.Count > 0)
            {
                Console.WriteLine("Extracted Text:");
                Console.WriteLine(response[0].Description);
            }
            else
            {
                Console.WriteLine("No text found in the image.");
            }
        }
    }
}
