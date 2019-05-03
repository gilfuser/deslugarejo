n = NetAddr.new("127.0.0.1", 7400);
(
w = Window.new("osc test");

f = w.addFlowLayout(5@5, 5@5);

[1,2,3,4].do({arg num;
	var oscpath = "/fader%/out".format(num);
	EZSlider.new(
		w,
		30@200,
		label: "f%".format(num),
		action: {arg tez;

			(oscpath ++ ", " ++ tez.value).postln;
			n.sendMsg(oscpath, tez.value);

		},
		layout:'vert'
	);
});

w.front;
);
// this example is basically like OSCFunc.trace but filters out
// /status.reply messages
(
g = { |msg, time, addr|
    if(msg[0] != '/status.reply') {
        "time: % sender: %\nmessage: %\n".postf(time, addr, msg);
    }
};
thisProcess.addOSCRecvFunc(g);
);

// stop posting.
/*
thisProcess.removeOSCRecvFunc(g);
*/

/*
n = NetAddr.new("127.0.0.1", 7401);
(w = Window.new("osc test");f = w.addFlowLayout(5@5, 5@5);[1,2,3,4].do({arg num; var oscpath = "/fader%/out".format(num);	EZSlider.new(w,	30@200,	label: "f%".format(num), action: {arg tez; (oscpath ++ ", " ++ tez.value).postln; n.sendMsg(oscpath, tez.value);	}, layout:'vert');}); w.front;);
g = { |msg, time, addr| if(msg[0] != '/status.reply') { "time: % sender: %\nmessage: %\n".postf(time, addr, msg);    }}; thisProcess.addOSCRecvFunc(g);
*/
