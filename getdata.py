#!/usr/bin/env python3

# Copyright (c) 2018 The Monero Project
# 
# All rights reserved.
# 
# Redistribution and use in source and binary forms, with or without modification, are
# permitted provided that the following conditions are met:
# 
# 1. Redistributions of source code must retain the above copyright notice, this list of
#    conditions and the following disclaimer.
# 
# 2. Redistributions in binary form must reproduce the above copyright notice, this list
#    of conditions and the following disclaimer in the documentation and/or other
#    materials provided with the distribution.
# 
# 3. Neither the name of the copyright holder nor the names of its contributors may be
#    used to endorse or promote products derived from this software without specific
#    prior written permission.
# 
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
# EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
# MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
# THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
# SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
# PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
# INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
# STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
# THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

"""Test blockchain RPC calls

Test the following RPCs:
    - get_info
    - generateblocks
    - [TODO: many tests still need to be written]

"""

from test_framework.daemon import Daemon

import sys
import datetime
import json
import requests
import urllib3
import time

class GetData():
    def run(self, port, height_window_index):
        HEIGHT_WINDOW_SIZE = 100000
        start_height = height_window_index * HEIGHT_WINDOW_SIZE
        end_height = start_height + HEIGHT_WINDOW_SIZE
        daemon = Daemon(port=port)
        res_info = daemon.get_info()
        if res_info['height'] < end_height:
            end_height = res_info['height']
        assert start_height < end_height
        print('var chartData_%d = [' % height_window_index)
        for i in range(start_height, end_height):
            if i > start_height and i % 1000 == 0: print("processed height:", i, file=sys.stderr)
            while True:
                try:
                    res_blk = daemon.getblock(i)
                    break
                except (Exception, OSError, requests.exceptions.ConnectionError, urllib3.exceptions.MaxRetryError, urllib3.exceptions.NewConnectionError) as e:
                    print('daemon.getblock() at height', i, ", error", e, file=sys.stderr)
                    print('Sleeping for a second', file=sys.stderr)
                    time.sleep(1)
                    continue

            block_header = res_blk['block_header']

            timestamp  = block_header['timestamp']
            nonce      = block_header['nonce']
            difficulty = block_header['difficulty']
            reward     = block_header['reward']
            block_size = block_header['block_size']
            num_txes   = block_header['num_txes']

            blob_size = len(res_blk['blob']) / 2
            # print(res_blk)
            # print('====================================================')

            while True:
                try:
                    res_txs = daemon.gettransactions(res_blk['tx_hashes']) if num_txes > 0 else None
                    break
                except (Exception, OSError, requests.exceptions.ConnectionError, urllib3.exceptions.MaxRetryError, urllib3.exceptions.NewConnectionError) as e:
                    print('daemon.gettransactions() at height', i, ", error", e, file=sys.stderr)
                    print('Sleeping for a second', file=sys.stderr)
                    time.sleep(1)
                    continue
            txs_str = ''
            for j in range(num_txes):
                tx_json = res_txs['txs'][j]['as_json']
                tx = json.loads(tx_json)
                unlock_time = tx['unlock_time']
                ins = len(tx['vin'])
                outs = len(tx['vout'])
                ring_size = len(tx['vin'][0]['key']['key_offsets'])
                ins_total = 0
                for k in range(ins):
                    ins_total += tx['vin'][k]['key']['amount']
                outs_total = 0
                for k in range(outs):
                    outs_total += tx['vout'][k]['amount']
                fee = tx['rct_signatures']['txnFee'] if (tx['version'] & 0xff) > 1 else ins_total - outs_total
                extra_size = len(tx['extra'])
                tx_size = len(res_txs['txs'][j]['as_hex']) / 2
                if j > 0:
                    txs_str += ','
                txs_str += "[%d,%d,%d,%d,%d,%d,%d,%d]" % (unlock_time, ins, outs, ring_size, fee, extra_size, ins_total, tx_size)
            print('[%d,%d,%d,%d,%d,%d,[%s]],' % (timestamp, nonce, difficulty, reward, block_size, blob_size, txs_str))
        print(']')

if __name__ == '__main__':
    GetData().run(int(sys.argv[1]), int(sys.argv[2]))
