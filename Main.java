import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.DataLine;
import javax.sound.sampled.Line;
import javax.sound.sampled.LineUnavailableException;
import javax.sound.sampled.Mixer;
import javax.sound.sampled.TargetDataLine;

public class Main {
	static int RightMicIndex = 0;
	static int LeftMicIndex = 0;
	
	public static void main(String[] args) {
		AudioFormat format = new AudioFormat(96000.0f, 16, 1, true, false);
		DataLine.Info info = new DataLine.Info(TargetDataLine.class, format); 

		// print all audio devices
		// you will need to manually select the correct microphone
		Mixer.Info[] infos = AudioSystem.getMixerInfo();
		// System.out.println(infos);
		for(int i = 0; i < infos.length; i++){
			Mixer mixer = AudioSystem.getMixer(infos[i]);
			Line.Info[] lines = mixer.getTargetLineInfo();
			for(int j = 0; j < lines.length; j++){
				// System.out.println(i + ": " + lines[j]);
				if ((lines[j]+ "").equals("interface TargetDataLine supporting 4 audio formats, and buffers of at least 32 bytes")){
					if (RightMicIndex != i || LeftMicIndex != i){
						if(RightMicIndex == 0){
							RightMicIndex = i;
						}else{
							LeftMicIndex = i;
						}
					}
				}
			}
		}
		// System.out.println("RightMicIndex: " + RightMicIndex + "\t" + "LeftMicIndex: " + LeftMicIndex);

		// if (!AudioSystem.isLineSupported(AudioSystem.getMixer(infos[6]).getTargetLineInfo()[1])) {
			// System.out.print(info);
		//} 
		try {
			TargetDataLine line1 = getLine(format, infos[RightMicIndex]);
			TargetDataLine line2 = getLine(format, infos[LeftMicIndex]);
			while(true){
				int max1 = MicReader.readBlock(line1, format);
				int max2 = MicReader.readBlock(line2, format);
				// System.out.println(Math.abs(max1) + "\t" + Math.abs(max2));
				if (max1 >= 5000 && max2 >= 5000){
					System.out.println(0);
				}else if (max1 >= 5000){
					System.out.println(-1);
				}else if (max2 >= 5000){
					System.out.println(1);
				}else{
					System.out.println(0);
				}
			}
		} catch (LineUnavailableException ex) {
			System.out.println(ex);
		}
	}
	
	static TargetDataLine getLine(AudioFormat format, Mixer.Info info) throws LineUnavailableException{
		TargetDataLine line = AudioSystem.getTargetDataLine(format, info);
		return line;
	}
}
